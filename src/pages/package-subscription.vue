<script setup>
import BarChartSummary from '@/components/package-subs/ChartJsBarChart.vue';
import DetailContactCenter from '@/components/package-subs/DetailContactCenter.vue';
import CustomTable from '@/components/user-management/CustomTable.vue';
import { useGlobalStore } from '@/store/useGlobalStore';
import iconCall from '@images/pages/icon-call.png';
import logoDEP from '@images/telakses/Teleakses_Solusindo_Logo_cropt.png';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';


const store = useGlobalStore()

const route = useRoute()
const router = useRouter()

const toLoginWaba = () => {
  router.replace('/')
}
  
const todayDate = ref('')

const months = {
  1:'January',
  2:'February',
  3:'March',
  4:'April',
  5:'May',
  6:'June',
  7:'July',
  8:'August',
  9:'September',
  10:'October',
  11:'November',
  12:'Desember', 
}

const days = {
  0:'Sunday',
  1:'Monday',
  2:'Tuesday',
  3:'Wednesday',
  4:'Thursday',
  5:'Friday',
  6:'Saturday',
}

const todayDateF = (type='') => {
  let today = new Date()
  let dd = today.getDate()
  let day = today.getDay()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let date =
      dd < 10 ? '0' + dd : dd
  if(type == 'summary'){
    return (
      months[month]
    )
  } else {
    return (
      days[day] +
      ', ' +
      date +
      ' ' +
      months[month] +
      ' ' +
      year
    )
  }
}

const toDateM = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let month = today.getMonth() + 1
  let year = today.getFullYear()
  
  return (
    months[month]
  )
}

const toDateDMY = unixTimestamp => {
  let today = new Date(unixTimestamp * 1000)
  let dd = today.getDate()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  let date = dd < 10 ? '0' + dd : dd
  
  return (
    date +
    ' ' +
    months[month] +
    ' ' +
    year
  )
}

const LazyErrorDialogs = defineAsyncComponent(() => import('@/views/pages/dialogs/Error.vue'))
const isErrorVisible = ref(false)
const customErrorMessages = ref('')

const tableDataBill = ref([])
const tableHeaderBill = ref(['Month', 'Status', 'Action'])
const tableDataReceipt = ref([])
const tableHeaderReceipt = ref(['Payment Time', 'Amount', 'Action'])
const totalPage = ref(1)
const totalReceipt = ref(0)

const tab = ref(1)

const rowPerPage = ref(5)
const currentPage = ref(1)

const detailContactCenter = ref(false)

const base64Logo = ref('')
const base64IconPhone = ref('')

const currentdata = ref({
  PackageName: '',
  PaymentType: '',
  wallet: {},
  balanceInformation: '',
  usageInformation: '',
  billID: '',
  status: '',
  receiptID: '',
})

const dataValue = ref({
  limit: 0,
  usage: [
    0,
    0,
    0,
    0,
  ],
})

// const filter = ref({
//   status: '',
// })

const userDataString = localStorage.getItem('user')
const userData = JSON.parse(userDataString)
const priv = userData?.priv

console.log("---------- hasil priv=", priv)

//////////////////////////////// Only for development purposes
function dummymoffasdofetchpaymenthistory (op, params, onSuccess, onError) { //ref untuk ke tampilan
  let dummyData = {
    histories: [
      {
        tstamp: 1692001077,
        status: 'Paid',
      },
      {
        tstamp: 1692001077,
        status: 'Unpaid',
      },
    ],
    total_pages : 1,
    total_rows : 4,
  }
  let dummyJSON = JSON.stringify(dummyData)
  setTimeout(function(){
    onSuccess(dummyJSON)
  }, 1000)
}
/////////////////////////////////////////////////////////////
const onDataError = e => {
  isErrorVisible.value = true
  customErrorMessages.value = e
}

const toCapitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

const getCompanyDetails = () => {
  console.log('getCompanyDetails')

  const params = {}

  // dummymoffasdopackagesubstemporary || window.moffas.do_request
  window.moffas.do_request(
    'get_company_details',
    params, 
    onGetCompanyDetails,
    onDataError,
  )
}

const onGetCompanyDetails = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  console.log ('iniiiiiii onGetCompanyDetails=', response)

  currentdata.value.PackageName = response.subscription.subscription_name
  currentdata.value.PaymentType = response.wallet.type
  currentdata.value.wallet = response.wallet

  if (currentdata.value.wallet.balance >= 0) {
    currentdata.value.balanceInformation = currentdata.value.wallet.balance
    currentdata.value.usageInformation = 0
    dataValue.value.limit = 0
  } else {
    currentdata.value.usageInformation = currentdata.value.wallet.balance
    currentdata.value.balanceInformation = 0
    let calculatedValue = ((response.wallet.balance) / response.wallet.balance_limit) * 100
    dataValue.value.limit = parseFloat(calculatedValue.toFixed())
  }
  

  if (currentdata.value.PaymentType == 'prepaid') {
    tab.value = 2
  } else {
    tab.value = 1
  }

  getSessionCount()
}

const getSessionCount = () => {
  console.log('getSessionCount')

  let currentDate = new Date('November 19, 2023 23:15:30')
  let currentDateEnd = (currentDate.getTime() / 1000).toFixed()

  currentDate.setDate(1)
  currentDate.setHours(0)
  currentDate.setMinutes(0)
  currentDate.setSeconds(0)
  currentDate.setMilliseconds(0)
  let currentDateStart = currentDate.getTime() / 1000

  const params = {
    start: currentDateStart,
    end: currentDateEnd,
  }

  // dummymoffasdopackagesubstemporary || window.moffas.do_request
  window.moffas.do_request(
    'get_session_count',
    params, 
    onGetSessionCount,
    onDataError,
  )
}

const onGetSessionCount = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  console.log ('iniiiiiii onGetSessionCount=', response)

  const counts = response.sessions[0].counts

  if (counts.marketing) {
      dataValue.value.usage[0] = counts.marketing;
  } 
  if (counts.utility) {
      dataValue.value.usage[1] = counts.utility;
  } 
  if (counts.authentication) {
      dataValue.value.usage[2] = counts.authentication;
  } 
  if (counts.service) {
      dataValue.value.usage[3] = counts.service;
  }

  fetchPaymentHistoryBill()
}

//////////////////////////// Operation for Previous Data Table

const fetchPaymentHistoryBill = () => {
  console.log('fetchPaymentHistoryBill')

  let params = {
    row_length: 3,
    current_page: currentPage.value,
  }

  // dummymoffasdofetchpaymenthistory window.moffas.do_request
  window.moffas.do_request(
    'get_bills',
    params, 
    onFetchPaymentHistoryBill,
    onDataError,
  )
}

const onFetchPaymentHistoryBill = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableDataBill.value = response.bills
}

const fetchPaymentHistoryReceipt = () => {
  console.log('fetchPaymentHistoryReceipt')

  let params = {
    row_length: rowPerPage.value,
    current_page: currentPage.value,
    filter_by: {
      context: 'top-up'
    },
  }

  // dummymoffasdofetchpaymenthistory window.moffas.do_request
  window.moffas.do_request(
    'get_receipts',
    params, 
    onFetchPaymentHistoryReceipt,
    onDataError,
  )
}

const onFetchPaymentHistoryReceipt = data => {
  const response = JSON.parse(data)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  tableDataReceipt.value = response.receipts
  totalPage.value = response.total_pages
  totalReceipt.value = response.total_rows
}

// 👉 Watch fetchPaymentHistoryReceipt
watch(fetchPaymentHistoryReceipt)

// 👉 Watch currentPage
watchEffect(() => {
  if (currentPage.value > totalPage.value && totalPage.value > 0)
    currentPage.value = totalPage.value
})

const paginationData = computed(() => {
  const firstIndex = tableDataReceipt.value.length > 0 ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tableDataReceipt.value.length + (currentPage.value - 1) * rowPerPage.value

  return `${ firstIndex } - ${ lastIndex } of ${ totalReceipt.value }`
})

const disabledButton = ref(true)

if (priv['update_user'] || Object.keys(priv).length === 0) {
  disabledButton.value = false
}

/////////////////////////////// JSPDF /////////////////////////////////
const documentType = ref('')
const totalTitleOfAmount = ref('')
const bodyBill = ref ([])
const headBill = ref ([])

const headPostpaid = ref ([
  'Description',
  {
    content: 'Price',
    styles: { halign: 'center'},
  },
  {
    content: 'Usage Amount',
    styles: { halign: 'center'},
  },
  {
    content: 'Payment',
    styles: { halign: 'center'},
  }, 
])

const headPrepaidNoAddOn = ref ([
  'Description',
  {
    content: 'Amount',
    styles: { halign: 'center'},
  },
  {
    content: 'Payment',
    styles: { halign: 'center'},
  }, 
])

const headPrepaidWithAddOn = ref ([
  'Description',
  {
    content: 'Amount',
    styles: { halign: 'center'},
  },
  {
    content: 'Quantity',
    styles: { halign: 'center'},
  },
  {
    content: 'Payment',
    styles: { halign: 'center'},
  }, 
])

const foot = ref ([
  {
    content: 'Amount Due To Be Paid',
    colSpan: 3,
    styles: { halign: 'center'},
  },
])

const documentData = ref({
  id: '',
  companyName: '',
  invoiceDate: '',
  invoiceFormatedDate: '',
  invoiceDueDate: '',
  statusPayment: '',
  amount: '',
  amountRpFormated: '',
  sof:'',
  rows: [],
  receipt: {},
  subscription: {},
  waba: {},
})

const changeAmount = amount => {
  const number = parseFloat(amount)
  const absoluteAmount = Math.abs(number)

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(absoluteAmount)

  return formattedNumber
}

const changeAmountNoComma = amount => {
  const number = parseFloat(amount)
  const absoluteAmount = Math.abs(number)

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    currency: 'IDR'
  }).format(absoluteAmount)

  return 'Rp ' + formattedNumber
}

const terbilang = (bilangan) => {
  bilangan = String(bilangan);
  // Split the input into integer and decimal parts
  let [integerPart, decimalPart] = bilangan.split('.');

  // Arrays to hold the words for digits, special cases, and magnitude units
  let angka = new Array(
    '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'
  );
  let kata = new Array(
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'
  );
  let tingkat = new Array('', 'Ribu', 'Juta', 'Milyar', 'Triliun');

  // Get the length of the integer part
  let panjang_bilangan = integerPart.length;

  // Variables to hold the words for building the final result
  let kalimat =  "";
  let i = 0;
  let j = 0;
  let subkalimat = ""
  let kata1 = ""
  let kata2 = ""
  let kata3 = ""

  // Check if the integer part is too long
  if (panjang_bilangan > 15) {
    kalimat = "Diluar Batas";
    return kalimat;
  }

  // Store each digit of the integer part in the 'angka' array
  for (i = 1; i <= panjang_bilangan; i++) {
    angka[i] = integerPart.substr(-(i), 1);
  }

  // Reset counters and variables
  i = 1;
  j = 0;
  kalimat = "";

  // Iterate over the digits in groups of three
  while (i <= panjang_bilangan) {
    subkalimat = "";
    kata1 = "";
    kata2 = "";
    kata3 = "";

    // Handle the hundreds place
    if (angka[i + 2] != "0") {
      if (angka[i + 2] == "1") {
          kata1 = "Seratus";
      } else {
          kata1 = kata[angka[i + 2]] + " Ratus";
      }
    }

    // Handle the tens place
    if (angka[i + 1] != "0") {
      if (angka[i + 1] == "1") {
          if (angka[i] == "0") {
              kata2 = "Sepuluh";
          } else if (angka[i] == "1") {
              kata2 = "Sebelas";
          } else {
              kata2 = kata[angka[i]] + " Belas";
          }
      } else {
          kata2 = kata[angka[i + 1]] + " Puluh";
      }
    }

    // Handle the ones place
    if (angka[i] != "0") {
      if (angka[i + 1] != "1") {
          kata3 = kata[angka[i]];
      }
    }

    // Combine the words for the current group of three digits
    if ((angka[i] != "0") || (angka[i + 1] != "0") || (angka[i + 2] != "0")) {
      subkalimat = kata1 + " " + kata2 + " " + kata3 + " " + tingkat[j] + " ";
    }

    // Concatenate the current group to the final result
    kalimat = subkalimat + kalimat;
    i = i + 3;
    j = j + 1;
  }

  // Replace "Satu Ribu" with "Seribu" if needed
  if ((angka[5] == "0") && (angka[6] == "0")) {
    kalimat = kalimat.replace("Satu Ribu", "Seribu");
  }

  if (decimalPart !== '00') {
    console.log('decimalPart', decimalPart)
    let kataDecimal = decimalPart.split('').map(digit => kata[digit]).join(' ');
    
    // Handle the tens and ones places of the decimal part
    if (decimalPart.length === 2) {
      console.log('decimalPart', decimalPart)

      if (decimalPart[0] == '1') {
          if (decimalPart[1] == "0") {
              kataDecimal = "Sepuluh";
          } else if (decimalPart[1] == "1") {
              kataDecimal = "Sebelas";
          } else {
              kataDecimal = kata[decimalPart[1]] + " Belas";
          }
      } else if (decimalPart[0] !== '0') {
          kataDecimal = kata[decimalPart[0]] + ' Puluh ' + kata[decimalPart[1]];
      }
    }

    kalimat += `Koma ${kataDecimal}`;
  }

  return (kalimat.trim().replace(/\s{2,}/g, ' ')) + " Rupiah";
}

const imgToBase64 = (src, type='', outputFormat) => {
  let img = new Image()
  img.src = src
  console.log('img', img.src)
  img.onload = function() {
    let canvas = document.createElement('CANVAS')
    let c2d = canvas.getContext('2d')
    let dataBase64
    canvas.width = img.width
    canvas.height = img.height
    c2d.drawImage(img, 0, 0)
    dataBase64 = canvas.toDataURL(outputFormat)

    if (type === 'logo') {
      base64Logo.value = dataBase64
    } else if (type === 'icon') {
      base64IconPhone.value = dataBase64
      console.log('base64IconPhone.value', base64IconPhone.value)
    }
  }
}

const getBase64 = () => {
  imgToBase64(logoDEP, 'logo'),
  imgToBase64(iconCall, 'icon')
}

let checkAddON = (item) => {
  return item.item_name == 'Add-on 1'
}

////////////////////////// invoice operation
const fetchBillForPDF = () => {
  console.log('fetchBillForPDF')

  let params = {
    bill_id:currentdata.value.billID,
    company_detail: true, 
  }

  // dummymoffasdodetailbill ## window.moffas.do_request
  window.moffas.do_request(
    'get_bill',
    params, 
    onFetchBillForPDF,
    onDataError,
  )
}

const onFetchBillForPDF = data => {
  
  const response = JSON.parse(data)

  console.log('response di onFetchBillForPDF')
  console.log(response)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  documentData.value.id = (response.id).toString()
  documentData.value.companyName = response.company_name
  documentData.value.invoiceDate = (response.issued_time).toString()
  documentData.value.invoiceFormatedDate = toDateDMY(response.issued_time)
  documentData.value.invoiceDueDate = toDateDMY(response.exp_time)
  documentData.value.statusPayment = response.status
  documentData.value.amount = response.amount
  documentData.value.amountRpFormated = changeAmount(response.amount)
  documentData.value.sof = ''

  documentData.value.subscription = response.subscription
  documentData.value.waba = response.waba
  documentData.value.waba.email = response.company_email
  documentData.value.subscription.wallet_type = currentdata.value.PaymentType

  documentData.value.rows = response.rows
  bodyBill.value = documentData.value.rows.map(row => [
    row.item_name,
    'Rp '+row.item_price+'/initiated/session',
    row.amount ? row.amount : '',
    changeAmount(row.total_price)
  ])

  headBill.value = headPostpaid.value

  if (documentData.value.statusPayment == 'unpaid') {
    totalTitleOfAmount.value = 'Amount Due To Be Paid'
  } else {
    totalTitleOfAmount.value = 'Payment Amount'
  } 

  foot.value.push(documentData.value.amountRpFormated)

  documentType.value = 'Bill'

  getInvoicePDF()
}


const fetchReceiptForPDF = () => {
  console.log('fetchReceiptForPDF')

  let params = {
    receipt_id:currentdata.value.receiptID,
	  company_detail: true, 
  }

  // dummymoffasdodetailbill ## window.moffas.do_request
  window.moffas.do_request(
    'get_receipt',
    params, 
    onFetchReceiptForPDF,
    onDataError,
  )
}

const onFetchReceiptForPDF = data => {
  
  const response = JSON.parse(data)

  console.log('response di onFetchReceiptForPDF')
  console.log(response)

  if (response.hasOwnProperty('trace_id')){
    customErrorMessages.value = response
    isErrorVisible.value = true
    
    return
  }

  documentData.value.id = (response.receipt_id).toString()
  documentData.value.companyName = response.company_name
  documentData.value.invoiceDate = (response.issued_time).toString()
  documentData.value.invoiceFormatedDate = toDateDMY(response.issued_time)
  documentData.value.statusPayment = response.status
  documentData.value.amount = response.amount
  documentData.value.amountRpFormated = changeAmount(response.amount)
  documentData.value.sof = response.sof

  documentData.value.subscription = response.subscription
  documentData.value.waba = response.waba
  documentData.value.waba.email = response.company_email
  documentData.value.subscription.wallet_type = currentdata.value.PaymentType

  if (response.st == 1) {
    documentData.value.statusPayment = 'paid'
  } else {
    documentData.value.statusPayment = 'unpaid'
  }

  documentData.value.rows = response.rows
  bodyBill.value = documentData.value.rows.map(row => [
    row.item_name,
    documentData.value.subscription.wallet_type == 'postpaid' || documentData.value.subscription.wallet_type == 'hybrid' ? 'Rp '+row.item_price+'/initiated/session' : changeAmount(row.item_price),
    row.amount ? row.amount : '',
    changeAmount(row.total_price)
  ])

  totalTitleOfAmount.value = 'Payment Amount'

  if (documentData.value.subscription.wallet_type == 'postpaid' || documentData.value.subscription.wallet_type == 'hybrid') {
    headBill.value = headPostpaid.value
  } else if (documentData.value.subscription.wallet_type == 'prepaid') {  
    headBill.value = headPrepaidWithAddOn.value
    
    // if (documentData.value.rows.some(checkAddON)) {
    //   console.log('msk ada AddON')
    //   headBill.value = headPrepaidWithAddOn.value
    // } else {
    //   console.log('msk tidak ada AddON')
    //   headBill.value = headPrepaidNoAddOn.value
    // }
  } 

  foot.value.push(documentData.value.amountRpFormated)

  documentType.value = 'Receipt'

  getInvoicePDF()
}

let company_logo = {
  w: 72,
  h: 40
};

let fontSizes={
  HeadTitleFontSize:18,
  Head2TitleFontSize:16,
  TitleFontSize:14,
  SubTitleFontSize:12,
  NormalFontSize:10,
  SmallFontSize:9
};

let lineSpacing={
  NormalSpacing:20,
  BillSpacing:30,
  BillSpacingTo:15,
  footerSpacingTo:19,
};

const getInvoicePDF = () => {
  let doc = new jsPDF('p', 'pt', 'a4')
  let rightStartCol1=350
  let rightStartCol2=450
  let startX=50
  let startY=25
  let startXTitleField=55
  let startYTitlesField=82
  let startXInput=150

  let startYBillField=180
  let startYSignatureField=570
  let startYFooterField=750
  let InitialstartY=69
  let bgColor = "#EFF0F3"

  let startXFooter=50
  let startYFooter=535

  let setLineXBottomForAmount=547

  /////// setting bg color in header invoice
  doc.setFillColor(bgColor)
  doc.rect(30, 20, 535, 145, 'F')

  doc.setFontSize(fontSizes.SubTitleFontSize)
  doc.setFont('helvetica', 'bold')
  doc.addImage(base64Logo.value,'PNG',startX,startY,company_logo.w,company_logo.h)
  doc.setFontSize(fontSizes.NormalFontSize)
  doc.text(documentType.value, 504, 50, {align:'right'})
  
  //////right side
  doc.setFontSize(fontSizes.NormalFontSize)
  doc.text(documentType.value+" Number", startXTitleField, startYTitlesField+=7)
  doc.text(":", 135, startYTitlesField)
  doc.setFont('helvetica', 'normal')
  doc.text(documentData.value.id, startXInput, startYTitlesField, {maxWidth:180})

  doc.setFont('helvetica', 'bold')
  doc.text("Name Package", startXTitleField, startYTitlesField+=lineSpacing.BillSpacing)
  doc.text(":", 135, startYTitlesField)
  doc.setFont('helvetica', 'normal')
  doc.text(documentData.value.subscription.subscription_name, startXInput, startYTitlesField)

  doc.setFont('helvetica', 'bold')
  doc.text("Payment Type", startXTitleField, startYTitlesField+=lineSpacing.NormalSpacing)
  doc.text(":", 135, startYTitlesField)
  doc.setFont('helvetica', 'normal')
  // doc.text(documentData.value.subscription.wallet_type, startXInput, startYTitlesField)
  doc.text(toCapitalize(documentData.value.subscription.wallet_type), startXInput, startYTitlesField)

  //////left side
  let tempY=InitialstartY
  doc.setFont('helvetica', 'bold')
  doc.text(documentType.value+" Date ",rightStartCol1,tempY+=lineSpacing.NormalSpacing)
  doc.text(":", 440, tempY)
  doc.setFont('helvetica', 'normal')
  doc.text(documentData.value.invoiceFormatedDate, rightStartCol2, tempY)

  if (
    documentType.value == 'Bill'
  ) {
    doc.setFont('helvetica', 'bold')
    doc.text("Due Date ",  rightStartCol1, tempY+=lineSpacing.NormalSpacing)
    doc.text(":", 440, tempY)
    doc.setFont('helvetica', 'normal')
    doc.text(documentData.value.invoiceDueDate,rightStartCol2, tempY)
  }

  doc.setFont('helvetica', 'bold')
  doc.text("Status Payment ",  rightStartCol1, tempY+=lineSpacing.NormalSpacing)
  doc.text(":", 440, tempY)
  doc.setFont('helvetica', 'bold')

  if (documentData.value.statusPayment == 'paid') {
    doc.setTextColor(13, 216, 94)
  } else {
    doc.setTextColor(237, 35, 36)
  }
  // doc.text(documentData.value.statusPayment,rightStartCol2, tempY)
  doc.text(toCapitalize(documentData.value.statusPayment),rightStartCol2, tempY)

  doc.setTextColor(13, 13, 13)
  if (documentData.value.sof) {
    doc.setFont('helvetica', 'bold')
    doc.text("Source of Found", rightStartCol1, tempY+=lineSpacing.NormalSpacing)
    doc.text(":", 440, tempY)
    doc.setFont('helvetica', 'normal')
    doc.text(documentData.value.sof, rightStartCol2, tempY)
  }
    
  //-------Info Billing From---------------------
  let startBilling=80
  let startYBilling=170
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(fontSizes.NormalFontSize)

  doc.text(documentType.value+" From:",startBilling, startYBilling+=lineSpacing.BillSpacing)

  doc.setFontSize(fontSizes.SmallFontSize)
  doc.text(
    'Indosat Ooredoo Hutchison', 
    startBilling, 
    startYBilling+=30
  )
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(fontSizes.SmallFontSize)
  doc.text(
    'Jl Medan Merdeka Barat No. 21, Jakarta Pusat, Jakarta 10110, Indonesia', 
    startBilling, 
    startYBilling+=15, 
    {maxWidth:180}
  )

  //-------Info Bill To or Shipping To---------------------
  let rightcol1 = 320
  let rightcol2 = 410

  doc.setFontSize(fontSizes.NormalFontSize)
  doc.setFont('helvetica', 'bold')
  doc.text(documentType.value+" To:", rightcol1, startYBillField+=lineSpacing.NormalSpacing)

  doc.setFontSize(fontSizes.SmallFontSize)
  // doc.text(documentData.value.companyName, rightcol1, startYBillField+=30, {maxWidth:230})
  doc.text(toCapitalize(documentData.value.companyName), rightcol1, startYBillField+=30, {maxWidth:230})
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(fontSizes.SmallFontSize)
  doc.text("WABA ID", rightcol1, startYBilling+=lineSpacing.NormalSpacing)
  doc.text(":", 400, startYBilling)
  doc.text(documentData.value.waba.waba_id, rightcol2, startYBilling, {maxWidth:180})

  doc.text("Phone Number", rightcol1, startYBilling+=lineSpacing.BillSpacingTo)
  doc.text(":", 400, startYBilling)
  doc.text(documentData.value.waba.phone_numbers[0].phone_number, rightcol2, startYBilling, {maxWidth:180})

  if (documentData.value.waba.email) {
    doc.text("Email", rightcol1, startYBilling+=lineSpacing.BillSpacingTo)
    doc.text(":", 400, startYBilling)
    doc.text(documentData.value.waba.email, rightcol2, startYBilling, {maxWidth:180})
  }

  //-------TABLE---------------------
  autoTable(doc, {
    columnStyles: { 
      0: { halign: 'left'},
      1: { halign: 'center'},
      2: { halign: 'center'},
      3: { halign: 'right'},
    },
    styles: { 
      cellPadding: 8,
    },
    head: [headBill.value],
    body: bodyBill.value,

    theme: 'plain',
    startY: 350,
  })

  // Add line at the top of the table
  doc.setLineWidth(1)
  doc.line(30, 350, 565, 350)

  doc.setLineWidth(1)
  doc.line(30, 380, 565, 380)

  // Add line at the bottom of the table
  let finalY = doc.lastAutoTable.finalY
  doc.setLineWidth(1)
  doc.line(30, finalY, 565, finalY)

  doc.setFillColor(bgColor)
  doc.rect(30, finalY+=5, 535, 60, 'F')

  doc.setFontSize(fontSizes.NormalFontSize)
  doc.setFont('helvetica', 'normal')
  doc.text(
    totalTitleOfAmount.value, 
    startXFooter, 
    finalY+=20,
  )

  doc.setFont('helvetica', 'bold')
  doc.text(documentData.value.amountRpFormated, setLineXBottomForAmount, finalY, {align:'right'})

  doc.text(
    terbilang(documentData.value.amount), 
    startXFooter, 
    finalY+=20,
    {maxWidth:500}
  )

  //-------Invoice Signature---------------------

  doc.setFont('helvetica', 'bold')
  doc.text("DEP Indosat",startBilling, finalY+=70)

  doc.addImage(base64Logo.value,'PNG',78,finalY,company_logo.w,company_logo.h)

  // doc.setFontSize(fontSizes.SmallFontSize)
  // doc.text('Authorised Signatory', startBilling, setLineYBottom+=65)

  //-------Invoice Footer---------------------  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(fontSizes.SmallFontSize)
  doc.text(
    'For questions concerning this document, please contact', 
    300, 
    startYFooterField, 
    {align:'center'}
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(fontSizes.SmallFontSize)
  doc.addImage(base64IconPhone.value,'PNG',255, 
    760,10,10)
  doc.text(
    '021-30008686', 
    300, 
    startYFooterField+=lineSpacing.footerSpacingTo, 
    {align:'center'}
  )

  doc.setFontSize(fontSizes.SmallFontSize)
  doc.text(
    'corporate.helpdesk@ioh.co.id', 
    300, 
    startYFooterField+=lineSpacing.footerSpacingTo, 
    {align:'center'}
  )

  doc.save(documentType.value+ '_' + toDateM(documentData.value.invoiceDate) + '_' + documentData.value.companyName + '.pdf')
}

////////////////////////////////////////////////////////////////////////

onMounted(() => {
  let isEmbeddedSignup = store.payloadFin.embedded_signup

  // DEV MODE
  // isEmbeddedSignup = true
  if(!isEmbeddedSignup){
    toLoginWaba()
  }
  todayDate.value = todayDateF()

  getCompanyDetails()

  getBase64()
})
</script>

<template>
  <section>
    <LazyErrorDialogs
      v-if="isErrorVisible"
      v-model:isDialogVisible="isErrorVisible" 
      :custom-error-message="customErrorMessages"
    />
    <div>
      <h6 class="text-2xl font-weight-bold mb-2">
        Package Subscription
      </h6>
      <div class="d-flex flex-wrap justify-space-between flex-column flex-sm-row">
        <!-- 👉 Left Content -->
        <div class="mb-1">
          <!-- 👉 Address -->
          <p class="mb-0 font-weight-medium">
            Information about the currently active package 
          </p>
        </div>

        <!-- 👉 Right Content -->
        <div class="mb-1">
          <!-- 👉 Issue Date -->
          <p class="mb-1 font-weight-medium">
            <span>{{ todayDate }} </span>
          </p>
        </div>
      </div>
    </div>
    <VCard class="d-flex">
      <VCol
        cols="8"
        class="pt-5"
      >
        <div class="pb-3">
          <p class="text-md font-weight-black ma-0">
            Package Name
          </p>
          <div class="text-h5 text-black pa-0">
            {{ currentdata.PackageName }}
          </div>
          <div class="text-caption font-weight-medium text-black pa-0 pt-2"> Information your package is currently active  </div>
        </div>
        <VRow align="center">
          <!-- {{ Balance Card }} -->
          <VCol 
            v-if="currentdata.PaymentType === 'prepaid' || currentdata.PaymentType === 'hybrid'" 
            cols="auto" 
            class="d-flex"
          >
            <VCard
              width="360"
              height="180"
              variant="flat"
              class="mx-auto"
              color="primary"
            >
              <div class="bg-top d-flex">
                <div class="pa-2 pt-3">
                  <div class="border-icon pa-1">
                    <VBadge color="warning" dot>
                      <VIcon icon="material-symbols:package" />
                    </VBadge>
                  </div>
                </div>
                <VCol cols="11" class="py-2 pl-0 pr-5">
                  <p class="text-md font-weight-black ma-0">
                    Information Balance
                  </p>
                  <div 
                    class="text-h5 text-white pa-0"
                  >
                    {{ changeAmount(currentdata.balanceInformation) }}
                  </div>
                </VCol>
              </div>
              <VCol cols="12" class="py-2 pl-12 pr-5">
                <div class="text-sm font-weight-black pa-0 pt-1">
                  Expired Time*
                </div>
                <VBtn
                  class="text-none font-weight-bold bg-grey-50 px-5"
                  rounded="xl"
                  variant="outlined"
                  style="cursor: default;"
                >
                  {{ toDateDMY(currentdata.wallet.exp_time) }}
                </VBtn>
                <h6 class="text-white font-weight-light ma-0 pr-2 pt-2">
                  *The package comes with a predefined expiration time
                </h6>
                <div class="d-flex align-center">
                </div>
              </VCol>
            </VCard>
          </VCol>

          <!-- {{ Limit Card }} -->
          <VCol
            v-if="currentdata.PaymentType === 'hybrid' || currentdata.PaymentType === 'postpaid'"
            cols="auto"
            class="d-flex"
          >
            <VCard
              class="mx-auto"
              width="390"
              height="180"
              color="primary"
              variant="flat"
            >
              <div class="bg-top d-flex">
                <div class="pa-2 pt-3">
                  <div 
                    class="border-icon pa-1"
                  >
                    <VBadge color="warning" dot>
                      <VIcon icon="material-symbols:package" />
                    </VBadge>
                  </div>
                </div>
                <VCol cols="11" class="py-2 pl-0 pr-5">
                  <p class="text-md font-weight-black ma-0">
                    Information Limit
                  </p>
                  <div 
                    class="text-h5 text-white pa-0"
                  >
                    <div v-if="currentdata.wallet.balance_limit == null || currentdata.PaymentType === 'postpaid'">
                      ∞
                    </div>
                    <div v-else>
                      {{ changeAmount(currentdata.wallet.balance_limit) }}
                    </div>
                  </div>
                </VCol>
              </div>
              <VCol cols="12" class="py-2 pl-12">                
                <div class="d-flex align-center">
                  <VCol cols="7" class="pa-0 pt-1">
                    <div class="text-caption font-weight-black">
                      Usage
                      {{ changeAmountNoComma(currentdata.usageInformation) }}
                    </div>
                  </VCol>
                  <VCol cols="" class="d-flex justify-end pa-0 pt-1">
                    <div class="d-flex text-caption">
                      <div v-if="currentdata.wallet.balance_limit == null || currentdata.PaymentType === 'postpaid'">
                        of ∞
                      </div>
                      <div v-else >
                        of {{ changeAmountNoComma(currentdata.wallet.balance_limit) }}
                      </div>
                    </div>
                  </VCol>
                </div>
                <VProgressLinear
                  v-model="dataValue.limit"
                  color="progress-dark-red"
                  bg-color="rgba(255, 255, 255, 1)"
                  bg-opacity="1"
                  height="8"
                />
                <!-- <div class="text-caption"> 
                  0% of the total limit has been spend 
                </div> -->
                <div v-if="currentdata.PaymentType !== 'postpaid'">
                  <div v-if="currentdata.wallet.balance_limit !== null" class="text-caption"> 
                    {{dataValue.limit}}% of the total limit has been spend 
                  </div>
                </div>
                <div class="d-flex align-center pt-3">
                  <p class="text-sm font-weight-black ma-0 pr-2">
                    Payment due
                  </p>
                  <VBtn
                    class="text-none font-weight-bold bg-grey-50 px-5"
                    rounded="xl"
                    variant="outlined"
                    style="cursor: default;"
                  >
                    <!-- 31 December 2023 -->
                    {{ toDateDMY(currentdata.wallet.exp_time) }}
                  </VBtn>
                </div>
              </VCol>
            </VCard>
          </VCol>
        </VRow>

        <!-- SUMMARY -->
        <div class="d-flex align-center pb-3 pt-4">
          <div class="text-h6 text-black pa-0 pr-3">
            Summary
          </div>
          <div class="text-caption text-black pa-0 pt-2"> Information your package is currently active in {{ todayDateF('summary') }}  </div>
        </div>
        <VCol cols="auto" class="pl-0 pt-0">
          <VCard
            class="d-flex px-0 pl-5 pt-3"
            height="200"
            color="grey-400"
            variant="outlined"
          >
            <BarChartSummary 
              :data="dataValue.usage"
            />

            <div class="pl-3">
              <div class="d-flex align-center pt-2">
                <VBtn
                  variant="text"
                  icon="material-symbols:circle"
                  color="#ED2324"
                  size="small"
                  style="cursor: default;"
                />  
                <span class="text-black text-body-2 font-weight-bold me-3">Customer Initiated (Inbound)</span>
              </div>
              <div class="d-flex align-center">
                <VBtn
                  variant="text"
                  icon="material-symbols:circle"
                  color="#FFCB05"
                  size="small"
                  style="cursor: default;"
                />  
                <span class="text-black text-body-2 font-weight-bold me-3">Business Initiated (Outbound)</span>
              </div>
            </div>
          </VCard>
        </VCol>

        <!-- Package Recommendation -->
        <!-- <div class="text-h5 text-black pa-0 pb-3 pt-6">
          Package Recommendation
        </div>
        <VRow align="center" class="pb-5">
          <VCol
            cols="auto"
            class="d-flex"
          >
            <VCard
              class="mx-auto"
              width="380"
              height="140"
              variant="elevated"
            >
              <VCardItem class="py-0 pt-10">
                <div>
                  <div class="text-h6 pb-1">
                    Medium Package
                  </div>
                </div>
              </VCardItem>

              <VCardActions class="pt-5">
                <VSpacer />
                <VBtn
                  class="text-none font-weight-bold px-8"
                  rounded="xl"
                  variant="flat"
                >
                  Show More
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
          <VCol
            cols="auto"
            class="d-flex"
          >
            <VCard
              class="mx-auto"
              width="380"
              height="140"
              variant="elevated"
            >
              <VCardItem class="py-0 pt-10">
                <div>
                  <div class="text-h6 pb-1">
                    Large Package
                  </div>
                </div>
              </VCardItem>

              <VCardActions class="pt-5">
                <VSpacer />
                <VBtn
                  class="text-none font-weight-bold px-8"
                  rounded="xl"
                  variant="flat"
                >
                  Show More
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow> -->
      </VCol>

      <VDivider vertical/>

      <VCol
        cols="4"
        class="pt-5"
      >
        <!-- Payment Type -->
        <div class="pb-3">
          <VCard 
            color="primary"
            variant="tonal"
          >
            <div class="text-h6 text-black text-center py-3">
              Payment Type
            </div>
          </VCard>
          <div>
            <div class="pt-6">
              <div class="text-h5 text-black text-center py-3">
                <div>
                  {{ toCapitalize(currentdata.PaymentType) }}
                </div>
              </div>
              <div 
                v-if="currentdata.PaymentType == 'postpaid'"
                class="text-caption text-justify"
              > 
                Postpaid services offering users to enjoy the benefits of a fixed monthly plan, eliminating the need for constant recharges. Ideal for those seeking stability and a predictable billing cycle.
              </div>
              <div 
                v-else-if="currentdata.PaymentType == 'prepaid'"
                class="text-caption text-justify"
              > 
                Prepaid services offer unparalleled flexibility and control, liberating users from the constraints of long-term contracts and credit checks. Ideal for various lifestyles, prepaid services are a traveler's ally, ensuring connectivity without roaming charges.
              </div>
              <div 
                v-else-if="currentdata.PaymentType == 'hybrid'"
                class="text-caption text-justify"
              > 
                Hybrid payment plans provide users with the benefits of both prepaid and postpaid services in a single, adaptable package. Allowing users to customize their usage, avoid surprises in billing, and adapt their plan to changing needs.
              </div>
            </div>
          </div>
          <div class="d-flex align-center justify-center pt-9 pb-3">
            <VBtn       
              class="text-none px-4"
              rounded="lg"
              prepend-icon="ri:customer-service-fill"
              variant="flat"
              @click="detailContactCenter = true"
            >
              Contact center
            </VBtn>
          </div>
        </div>

        <VDivider />

        <!-- Table History Payment -->
        <div class="pt-4">
          <VTabs
            v-if="currentdata.PaymentType === 'hybrid'"
            v-model="tab"
            bg-color="transparent"
            color="primary"
            align-tabs="center"
            grow
          >
            <VTab :value="1">Postpaid</VTab>
            <VTab :value="2">Prepaid</VTab>
          </VTabs>

          <VWindow v-model="tab">
            <VWindowItem
              :value="1"
            >
              <div class="py-2">
                <span class="font-weight-bold text-black">
                  History
                </span>
                <VTooltip location="end center" origin="start top">
                  <template v-slot:activator="{ props }">
                    <VBtn
                      v-bind="props"
                      size="small"
                      variant="text"
                      icon
                      color="#ABA6A6"
                    >
                      <VIcon>
                        mdi-information
                      </VIcon>
                    </VBtn>
                  </template>
                  <span>Showing your list of billing history (only available for the past 3 months)</span>
                </VTooltip>
              </div>
              <VDivider :thickness="2"/>
              <CustomTable
                :table-header-names="tableHeaderBill" 
                :table-data-length="tableDataBill.length"
              >
                <template #tableBody>
                  <tr
                    v-for="(row, indexA) in tableDataBill"
                    :key="indexA"
                    class="bg-hover"
                  >
                    <td class="text-black text-center pl-5">
                      {{ toDateM(row.issued_time) }}
                    </td>
                    <td
                      class="text-no-wrap"                
                      :class="{
                        'status-field-color-red': row['status'] == 'unpaid',
                        'status-field-color-green': row['status'] == 'paid',
                      }"
                    >
                      <VIcon
                        icon="mdi-circle-medium"
                      />              
                      {{ row.status }}
                    </td>
                    <td class="text-black text-center text-no-wrap">     
                      <VBtn
                        class="text-none text-white ma-2"
                        density="compact"
                        size="small"
                        prepend-icon="mdi-tray-arrow-down"
                        color="#32BCAD"
                        @click="() => {
                          currentdata.billID = row.id
                          currentdata.status = row.status
                          fetchBillForPDF()
                        }"
                      >
                        Bill
                      </VBtn>
                      <VBtn
                        v-if="row.status === 'paid'"
                        class="text-none text-white"
                        density="compact"
                        size="small"
                        prepend-icon="mdi-tray-arrow-down"
                        color="primary"
                        @click="() => {
                          currentdata.receiptID = row.receipt_id
                          fetchReceiptForPDF()
                        }"
                      >
                        Receipt
                      </VBtn>
                    </td>
                  </tr>
                </template>
              </CustomTable>
            </VWindowItem>

            <VWindowItem
              :value="2"
            >
              <div class="py-2">
                <span class="font-weight-bold text-black">
                  History
                </span>
                <VTooltip location="end center" origin="start top">
                  <template v-slot:activator="{ props }">
                    <VBtn
                      v-bind="props"
                      size="small"
                      variant="text"
                      icon
                      color="#ABA6A6"
                    >
                      <VIcon>
                        mdi-information
                      </VIcon>
                    </VBtn>
                  </template>
                  <span>Showing your list of top-up history</span>
                </VTooltip>
              </div>
              <VDivider :thickness="2"/>
              <CustomTable
                :table-header-names="tableHeaderReceipt" 
                :table-data-length="tableDataReceipt.length"
              >
                <template #tableBody>
                  <tr
                    v-for="(row, indexB) in tableDataReceipt"
                    :key="indexB"
                    class="bg-hover"
                  >
                    <td class="text-black pl-5">
                      {{ toDateDMY(row.payment_time) }}
                    </td>
                    <td class="text-black text-center text-no-wrap pl-8">
                      {{ changeAmountNoComma(row.amount) }}
                    </td>
                    <td class="text-black text-center text-no-wrap">     
                      <VBtn
                        class="text-none text-white"
                        density="compact"
                        size="small"
                        color="primary"
                        prepend-icon="mdi-tray-arrow-down"
                        @click="() => {
                          currentdata.receiptID = row.receipt_id
                          fetchReceiptForPDF()
                        }"
                      >
                        Receipt
                      </VBtn>
                    </td>
                  </tr>
                </template>
              </CustomTable>
              <VDivider />
              <VCardText class="d-flex align-center font-weight-bold text-black">
                <span>
                  {{ paginationData }}
                </span>
                <VSpacer />
                <VPagination
                  v-model="currentPage"
                  size="small"
                  :total-visible="3"
                  :length="totalPage"
                  @next="selectedRows = []"
                  @prev="selectedRows = []"
                />
              </VCardText>
            </VWindowItem>
          </VWindow>
        </div>
      </VCol>
    </VCard>

    <DetailContactCenter
      v-model:is-dialog-visible="detailContactCenter"
      rounded="lg"
      width="50%"
      title="Contact our contact center team"
    />
  </section>
</template>
  
<style lang="scss" scoped>
  .th {
    position: relative;
  }

  .th-background-color {
    background-color: #f9fafc;
  }

  .th-span-border {
    border-inline-start: 0.2rem solid #aca7a7;
    color: black;
    padding-inline-start: 0.5rem;
  }

  .th-span-border-row-count {
    padding: 0;
    border-inline-start: 0.2rem solid #aca7a7;
    color: black;
    padding-inline-start: 0.5rem;
  }

  .th-span-no-border {
    color: black;
    padding-inline-start: 4px;
  }

  .bg-hover:hover {
    background-color: rgba(68, 73, 74, 5%);
  }

  .status-field-color-red {
    color: #ff1f00;
  }

  .status-field-color-green {
    color: #0dd85e;
  }

  .status-field-bgcolor-primary {
    --v-theme-overlay-multiplier: var(--v-theme-primary-overlay-multiplier);

    background: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-on-primary)) !important;
  }

  .status-field-bgcolor-grey {
    --v-theme-overlay-multiplier: var(--v-theme-grey-400-overlay-multiplier);

    background: rgb(var(--v-theme-grey-400)) !important;
    color: rgb(var(--v-theme-on-grey-400)) !important;
  }

  .border-icon {
    border: solid white;
    border-radius: 5px;
    block-size: 38px;
    inline-size: 37px;
  }

  .text-h5 {
    font-weight: 700;
    line-height: 20px;
  }

  .text-h6 {
    font-weight: 700;
    line-height: 20px;
  }

  .bg-top {
    background-color: rgb(216, 31, 32, 100%);
  }
</style>

<route lang="yaml">
  meta:
    requiresAuth: true
</route>
