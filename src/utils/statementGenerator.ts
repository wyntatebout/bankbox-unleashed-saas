
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
}

const templateConfigs: Record<StatementTemplate, TemplateConfig> = {
  modern: {
    primaryColor: '#1A73E8',
    secondaryColor: '#F8FAFC',
    fontColor: '#202124',
    accentColor: '#34A853',
    headerStyle: { fillColor: [240, 240, 240], textColor: [32, 33, 36], fontStyle: 'bold' },
    bodyStyle: { lineColor: [220, 220, 220] },
    footerStyle: { fillColor: [240, 240, 240], textColor: [32, 33, 36], fontStyle: 'bold' }
  },
  classic: {
    primaryColor: '#1E293B',
    secondaryColor: '#F1F5F9',
    fontColor: '#0F172A',
    accentColor: '#475569',
    headerStyle: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyle: { lineColor: [220, 220, 220] },
    footerStyle: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' }
  },
  minimal: {
    primaryColor: '#666666',
    secondaryColor: '#FFFFFF',
    fontColor: '#333333',
    accentColor: '#999999',
    headerStyle: { fillColor: [255, 255, 255], textColor: [51, 51, 51], fontStyle: 'bold' },
    bodyStyle: { lineColor: [240, 240, 240] },
    footerStyle: { fillColor: [255, 255, 255], textColor: [51, 51, 51], fontStyle: 'bold' }
  },
  branded: {
    primaryColor: '#6C92F4',
    secondaryColor: '#E1EBFF',
    fontColor: '#1E293B',
    accentColor: '#34A853',
    headerStyle: { fillColor: [108, 146, 244], textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyle: { lineColor: [225, 235, 255] },
    footerStyle: { fillColor: [108, 146, 244], textColor: [255, 255, 255], fontStyle: 'bold' }
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
  
  // Add letterhead
  addLetterhead(doc, template, account.name, period, includeAccountNumbers ? account.accountNumber : undefined);
  
  // Add watermark if specified
  if (watermark) {
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(60);
    doc.setGState(doc.GState({ opacity: 0.3 }));
    doc.text(watermark, pageWidth/2, pageHeight/2, { align: 'center', angle: 45 });
    doc.setGState(doc.GState({ opacity: 1.0 }));
  }
  
  // Add account summary section
  addAccountSummary(doc, account, templateConfig, transactions);
  
  // Add transaction table
  addTransactionTable(doc, transactions, templateConfig);
  
  // Password protect if required
  if (passwordProtect && password) {
    doc.setEncryption(password, password, { 
      printing: ['highResolution'], 
      modifying: false, 
      copying: false, 
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false 
    });
  }
  
  return doc;
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
  
  if (template === 'modern') {
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('BANK STATEMENT', 20, 25);
  } else if (template === 'classic') {
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('FINANCIAL STATEMENT', 20, 20);
  } else if (template === 'minimal') {
    doc.setDrawColor(config.primaryColor);
    doc.setLineWidth(1);
    doc.line(20, 20, pageWidth - 20, 20);
    doc.setTextColor(config.fontColor);
    doc.setFontSize(16);
    doc.text('BANK STATEMENT', 20, 15);
  } else if (template === 'branded') {
    // Gradient header effect
    for (let i = 0; i < 40; i++) {
      const alpha = 1 - (i / 40);
      doc.setFillColor(108, 146, 244, alpha);
      doc.rect(0, i, pageWidth, 1, 'F');
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('PREMIUM BANKING', 20, 25);
  }
  
  // Add statement details
  doc.setTextColor(config.fontColor);
  doc.setFontSize(12);
  
  // Different Y position based on template
  const startY = template === 'minimal' ? 30 : 50;
  
  doc.text(`Statement Period: ${period}`, 20, startY);
  doc.text(`Account: ${accountName}`, 20, startY + 8);
  
  if (accountNumber) {
    doc.text(`Account Number: ${accountNumber}`, 20, startY + 16);
  }
  
  doc.text(`Generated On: ${format(new Date(), 'MMMM dd, yyyy')}`, 20, startY + (accountNumber ? 24 : 16));
  
  // Add horizontal line to separate header from content
  doc.setDrawColor(config.accentColor);
  doc.setLineWidth(0.5);
  doc.line(20, startY + (accountNumber ? 30 : 22), pageWidth - 20, startY + (accountNumber ? 30 : 22));
  
  return startY + (accountNumber ? 40 : 32); // Return the Y position where content should start
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
  doc.roundedRect(20, startY, pageWidth - 40, 40, 3, 3, 'FD');
  
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
  
  const col1 = pageWidth / 2;
  
  doc.text(`Opening Balance: ${formatCurrency(openingBalance)}`, col1, startY + 10);
  doc.text(`Total Deposits: ${formatCurrency(totalDeposits)}`, col1, startY + 20);
  doc.text(`Total Withdrawals: ${formatCurrency(totalWithdrawals)}`, col1, startY + 30);
  doc.text(`Closing Balance: ${formatCurrency(closingBalance)}`, col1, startY + 40);
  
  return startY + 50; // Return the Y position where transactions should start
};

// Add transaction table
const addTransactionTable = (
  doc: jsPDF, 
  transactions: Transaction[],
  templateConfig: TemplateConfig
) => {
  // Format transactions for the table
  const tableData = transactions.map(tx => [
    format(new Date(tx.date), 'MM/dd/yyyy'),
    tx.description,
    tx.category,
    tx.amount > 0 ? `+${formatAmount(tx.amount)}` : formatAmount(tx.amount),
    formatAmount(tx.balance)
  ]);
  
  // Sort transactions by date
  tableData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Add the transactions table
  doc.setFontSize(10);
  doc.text('TRANSACTION HISTORY', 20, 150);
  
  autoTable(doc, {
    startY: 155,
    head: [['Date', 'Description', 'Category', 'Amount', 'Balance']],
    body: tableData,
    headStyles: templateConfig.headerStyle,
    bodyStyles: templateConfig.bodyStyle,
    footStyles: templateConfig.footerStyle,
    margin: { top: 155, right: 20, bottom: 20, left: 20 },
    didDrawPage: (data) => {
      // Add page numbers
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    }
  });
  
  // Add footer on the last page
  const pageCount = doc.getNumberOfPages();
  doc.setPage(pageCount);
  
  const footerY = doc.internal.pageSize.height - 25;
  doc.setFontSize(8);
  doc.setTextColor(templateConfig.fontColor);
  doc.text('This statement is for informational purposes only.', 20, footerY);
  doc.text('Please contact customer service for any questions regarding this statement.', 20, footerY + 5);
  
  return doc;
};

// Helper function to format amount
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
