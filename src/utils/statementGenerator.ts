
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Define template styles
export type StatementTemplate = 'modern' | 'classic' | 'minimal' | 'branded';

interface TemplateConfig {
  primaryColor: string;
  secondaryColor: string;
  fontColor: string;
  accentColor: string;
  headerStyle: any;
  bodyStyle: any;
  footerStyle: any;
  logoPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  securityFeatures: {
    watermarkColor: string;
    watermarkOpacity: number;
    microprint: boolean;
  };
}

const templateConfigs: Record<StatementTemplate, TemplateConfig> = {
  modern: {
    primaryColor: '#6C92F4',
    secondaryColor: '#F8FAFC',
    fontColor: '#202124',
    accentColor: '#34A853',
    headerStyle: { fillColor: [108, 146, 244], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyle: { lineColor: [220, 220, 220] },
    footerStyle: { fillColor: [108, 146, 244], textColor: [255, 255, 255], fontStyle: 'bold' },
    logoPosition: { x: 20, y: 15, width: 40, height: 15 },
    securityFeatures: {
      watermarkColor: '#6C92F4',
      watermarkOpacity: 0.08,
      microprint: true
    }
  },
  classic: {
    primaryColor: '#1E293B',
    secondaryColor: '#F1F5F9',
    fontColor: '#0F172A',
    accentColor: '#475569',
    headerStyle: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyle: { lineColor: [220, 220, 220] },
    footerStyle: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    logoPosition: { x: 20, y: 15, width: 40, height: 15 },
    securityFeatures: {
      watermarkColor: '#1E293B',
      watermarkOpacity: 0.05,
      microprint: true
    }
  },
  minimal: {
    primaryColor: '#666666',
    secondaryColor: '#FFFFFF',
    fontColor: '#333333',
    accentColor: '#999999',
    headerStyle: { fillColor: [255, 255, 255], textColor: [51, 51, 51], fontStyle: 'bold' },
    bodyStyle: { lineColor: [240, 240, 240] },
    footerStyle: { fillColor: [255, 255, 255], textColor: [51, 51, 51], fontStyle: 'bold' },
    logoPosition: { x: 20, y: 15, width: 40, height: 15 },
    securityFeatures: {
      watermarkColor: '#666666',
      watermarkOpacity: 0.03,
      microprint: true
    }
  },
  branded: {
    primaryColor: '#6C92F4',
    secondaryColor: '#E1EBFF',
    fontColor: '#1E293B',
    accentColor: '#34A853',
    headerStyle: { fillColor: [108, 146, 244], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyle: { lineColor: [225, 235, 255] },
    footerStyle: { fillColor: [108, 146, 244], textColor: [255, 255, 255], fontStyle: 'bold' },
    logoPosition: { x: 20, y: 15, width: 40, height: 15 },
    securityFeatures: {
      watermarkColor: '#6C92F4',
      watermarkOpacity: 0.1,
      microprint: true
    }
  },
};

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  balance: number;
}

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  limit?: number;
}

interface StatementOptions {
  template: StatementTemplate;
  account: Account;
  period: string;
  includeAccountNumbers: boolean;
  transactions: Transaction[];
  passwordProtect?: boolean;
  password?: string;
  watermark?: string;
}

export const generateBankStatement = (options: StatementOptions): jsPDF => {
  const {
    template,
    account,
    period,
    includeAccountNumbers,
    transactions,
    passwordProtect,
    password,
    watermark
  } = options;

  const templateConfig = templateConfigs[template];
  
  // Initialize PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Generate unique document ID
  const documentId = `STMT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  
  // Determine statement period dates
  const periodText = `Statement Period: ${period}`;
  
  // Add security background pattern (microprint)
  if (templateConfig.securityFeatures.microprint) {
    addSecurityBackground(doc, templateConfig);
  }
  
  // Add letterhead
  addLetterhead(doc, template, account.name, periodText, includeAccountNumbers ? account.accountNumber : undefined);
  
  // Add watermark if specified
  if (watermark) {
    doc.setTextColor(
      hexToRgb(templateConfig.securityFeatures.watermarkColor).r,
      hexToRgb(templateConfig.securityFeatures.watermarkColor).g,
      hexToRgb(templateConfig.securityFeatures.watermarkColor).b
    );
    doc.setFontSize(60);
    // Fix for GState - use the proper API
    doc.saveGraphicsState();
    doc.setGState({ opacity: templateConfig.securityFeatures.watermarkOpacity });
    doc.text(watermark, pageWidth/2, pageHeight/2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();
  }
  
  // Add account summary section
  addAccountSummary(doc, account, templateConfig, transactions);
  
  // Add transaction table
  addTransactionTable(doc, transactions, templateConfig);
  
  // Add document verification section
  addVerificationSection(doc, documentId, templateConfig);
  
  // Password protect if required
  if (passwordProtect && password) {
    // Note: In newer jsPDF versions, we need to use the security plugin
    // This implementation uses the newer API
    doc.setDocumentProperties({
      title: `Statement - ${account.name} - ${period}`,
      subject: `Account Statement for ${account.name}`,
      author: 'Banking Services',
      keywords: 'statement, account, banking',
      creator: 'Statement Generator'
    });
    
    // Note that we need to finalize the document before applying encryption
    // So if you use encryption, we'll need to return a different way
    
    // We'll handle it during the saving process in the Accounts component
    // The component will need to call doc.output('dataurlstring', {...encryption options})
  }
  
  return doc;
};

// Convert hex color to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Add security background pattern
const addSecurityBackground = (doc: jsPDF, templateConfig: TemplateConfig) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add subtle grid pattern
  doc.setDrawColor(hexToRgb(templateConfig.primaryColor).r, 
                  hexToRgb(templateConfig.primaryColor).g, 
                  hexToRgb(templateConfig.primaryColor).b);
  doc.setLineWidth(0.1);
  
  // Fix for GState - use the proper API
  doc.saveGraphicsState();
  doc.setGState({ opacity: 0.03 });
  
  // Create a pattern of dots instead of text as microprinting
  doc.setFontSize(3);
  doc.setTextColor(
    hexToRgb(templateConfig.primaryColor).r,
    hexToRgb(templateConfig.primaryColor).g,
    hexToRgb(templateConfig.primaryColor).b
  );
  
  // Use dot patterns instead of text
  for (let y = 10; y < pageHeight; y += 15) {
    for (let x = 5; x < pageWidth; x += 10) {
      doc.circle(x, y, 0.2, 'F');
    }
  }
  
  // Reset graphics state
  doc.restoreGraphicsState();
  doc.setLineWidth(0.5);
};

// Add letterhead to the PDF
const addLetterhead = (
  doc: jsPDF, 
  template: StatementTemplate, 
  accountName: string, 
  period: string,
  accountNumber?: string
) => {
  const config = templateConfigs[template];
  const pageWidth = doc.internal.pageSize.width;
  
  // Add bank logo & name based on template
  doc.setFillColor(config.primaryColor);
  
  if (template === 'modern' || template === 'branded') {
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('BANK', 70, 25);
    doc.setFontSize(12);
    doc.text('ACCOUNT STATEMENT', 70, 35);
  } else if (template === 'classic') {
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('FINANCIAL STATEMENT', 70, 20);
    doc.setFontSize(10);
    doc.text('SECURE DOCUMENT', 70, 30);
  } else if (template === 'minimal') {
    doc.setDrawColor(config.primaryColor);
    doc.setLineWidth(1);
    doc.line(20, 20, pageWidth - 20, 20);
    doc.setTextColor(config.fontColor);
    doc.setFontSize(16);
    doc.text('BANK STATEMENT', 20, 15);
  }
  
  // Add statement date in the top right
  const today = format(new Date(), 'MMMM dd, yyyy');
  doc.setFontSize(10);
  
  if (template !== 'minimal') {
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated: ${today}`, pageWidth - 30, 15, { align: 'right' });
  } else {
    doc.setTextColor(config.fontColor);
    doc.text(`Generated: ${today}`, pageWidth - 20, 15, { align: 'right' });
  }
  
  // Add statement details
  doc.setTextColor(config.fontColor);
  doc.setFontSize(12);
  
  // Different Y position based on template
  const startY = template === 'minimal' ? 30 : 50;
  
  doc.text(`${period}`, 20, startY);
  doc.text(`Account: ${accountName}`, 20, startY + 8);
  
  if (accountNumber) {
    const maskedNumber = accountNumber.replace(/\d(?=\d{4})/g, "•");
    doc.text(`Account Number: ${maskedNumber}`, 20, startY + 16);
  }
  
  // Page number (will be updated for each page)
  doc.setFontSize(10);
  doc.text('Page 1', pageWidth - 20, startY, { align: 'right' });
  
  // Add horizontal line to separate header from content
  doc.setDrawColor(config.accentColor);
  doc.setLineWidth(0.5);
  doc.line(20, startY + (accountNumber ? 24 : 16), pageWidth - 20, startY + (accountNumber ? 24 : 16));
  
  return startY + (accountNumber ? 34 : 26); // Return the Y position where content should start
};

// Add account summary section
const addAccountSummary = (
  doc: jsPDF, 
  account: Account, 
  templateConfig: TemplateConfig,
  transactions: Transaction[]
) => {
  const pageWidth = doc.internal.pageSize.width;
  const startY = 90;
  
  // Set colors for the summary box
  doc.setFillColor(templateConfig.secondaryColor);
  doc.setDrawColor(templateConfig.primaryColor);
  
  // Create a box for the summary
  doc.roundedRect(20, startY, pageWidth - 40, 60, 3, 3, 'FD');
  
  // Add summary title
  doc.setTextColor(templateConfig.primaryColor);
  doc.setFontSize(14);
  doc.text('ACCOUNT SUMMARY', 30, startY + 15);
  
  // Calculate summary information
  const openingBalance = transactions.length > 0 ? transactions[0].balance - transactions[0].amount : account.balance;
  const closingBalance = account.balance;
  
  const deposits = transactions.filter(tx => tx.amount > 0);
  const withdrawals = transactions.filter(tx => tx.amount < 0);
  
  const totalDeposits = deposits.reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawals = Math.abs(withdrawals.reduce((sum, tx) => sum + tx.amount, 0));
  
  // Calculate fees and interest (mocked for this example)
  const fees = -(Math.random() * 5).toFixed(2);
  const interest = (Math.random() * 2).toFixed(2);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Add summary values
  doc.setTextColor(templateConfig.fontColor);
  doc.setFontSize(10);
  
  const col1X = 40;
  const col2X = pageWidth / 2 + 20;
  
  // Left column
  doc.text('Opening Balance:', col1X, startY + 30);
  doc.text('Total Deposits:', col1X, startY + 40);
  doc.text('Total Withdrawals:', col1X, startY + 50);
  
  // Right column
  doc.text('Fees Charged:', col2X, startY + 30);
  doc.text('Interest Earned:', col2X, startY + 40);
  doc.text('Closing Balance:', col2X, startY + 50);
  
  // Values in bold
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(openingBalance), col1X + 80, startY + 30, { align: 'right' });
  doc.text(formatCurrency(totalDeposits), col1X + 80, startY + 40, { align: 'right' });
  doc.text(formatCurrency(totalWithdrawals), col1X + 80, startY + 50, { align: 'right' });
  
  doc.text(formatCurrency(Number(fees)), col2X + 80, startY + 30, { align: 'right' });
  doc.text(formatCurrency(Number(interest)), col2X + 80, startY + 40, { align: 'right' });
  doc.text(formatCurrency(closingBalance), col2X + 80, startY + 50, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  
  // Add available balance if relevant (for credit accounts)
  if (account.limit) {
    const availableCredit = account.limit - account.balance;
    doc.text('Available Credit:', pageWidth - 100, startY + 70);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(availableCredit), pageWidth - 20, startY + 70, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  }
  
  return startY + 80; // Return the Y position where transactions should start
};

// Add transaction table
const addTransactionTable = (
  doc: jsPDF, 
  transactions: Transaction[],
  templateConfig: TemplateConfig
) => {
  // Format transactions for the table
  const tableData = transactions.map(tx => {
    const txDate = format(new Date(tx.date), 'MM/dd/yyyy');
    const type = tx.amount > 0 ? 'CREDIT' : 'DEBIT';
    
    return [
      txDate,
      tx.description,
      tx.category,
      type,
      tx.amount > 0 ? formatAmount(tx.amount) : '',
      tx.amount < 0 ? formatAmount(Math.abs(tx.amount)) : '',
      formatAmount(tx.balance)
    ];
  });
  
  // Sort transactions by date
  tableData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Add the transactions table
  doc.setFontSize(14);
  doc.setTextColor(templateConfig.primaryColor);
  doc.text('TRANSACTION HISTORY', 20, 170);
  
  autoTable(doc, {
    startY: 175,
    head: [['Date', 'Description', 'Category', 'Type', 'Credit', 'Debit', 'Balance']],
    body: tableData,
    headStyles: templateConfig.headerStyle,
    bodyStyles: templateConfig.bodyStyle,
    footStyles: templateConfig.footerStyle,
    margin: { top: 175, right: 20, bottom: 40, left: 20 },
    didDrawPage: (data) => {
      // Add page numbers
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(10);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 30);
        
        // Add letterhead to each page
        if (i > 1) {
          // Simplified header for subsequent pages
          doc.setFillColor(templateConfig.primaryColor);
          doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.text('BANK', 20, 14);
        }
      }
    }
  });
  
  return doc;
};

// Add verification section with QR code and document ID
const addVerificationSection = (doc: jsPDF, documentId: string, templateConfig: TemplateConfig) => {
  const pageCount = doc.getNumberOfPages();
  doc.setPage(pageCount);
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 60;
  
  // Add footer with document verification information
  doc.setDrawColor(templateConfig.primaryColor);
  doc.setFillColor(templateConfig.secondaryColor);
  doc.roundedRect(20, footerY, pageWidth - 40, 40, 3, 3, 'FD');
  
  // Document verification information
  doc.setTextColor(templateConfig.primaryColor);
  doc.setFontSize(12);
  doc.text('IMPORTANT ACCOUNT INFORMATION', 30, footerY + 10);
  
  doc.setTextColor(templateConfig.fontColor);
  doc.setFontSize(8);
  doc.text('This document is an official bank statement.', 30, footerY + 20);
  doc.text(`Document ID: ${documentId}`, 30, footerY + 27);
  doc.text('To verify the authenticity of this document, please visit /verify', 30, footerY + 34);
  
  // Contact information
  doc.text('CONTACT US', pageWidth - 100, footerY + 10);
  doc.text('Customer Service: 1-800-SERVICE', pageWidth - 100, footerY + 20);
  doc.text('Secure Message: online.banking.site', pageWidth - 100, footerY + 27);
  doc.text('Mail: P.O. Box 12345, San Francisco, CA 94107', pageWidth - 100, footerY + 34);
  
  return doc;
};

// Helper function to format amount
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
