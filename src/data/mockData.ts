import type { Booking, Owner } from '../types'

export const ALL_OWNERS: Owner[] = [
  { id: '1', name: 'Ajay Kumar',     initials: 'AK', borderColor: 'border-blue-400',   textColor: 'text-blue-600',   bgColor: 'bg-blue-50' },
  { id: '2', name: 'Ajay Thakur',    initials: 'AT', borderColor: 'border-indigo-400', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { id: '3', name: 'Ajay Sharma',    initials: 'AS', borderColor: 'border-pink-400',   textColor: 'text-pink-600',   bgColor: 'bg-pink-50' },
  { id: '4', name: 'Harshit Roy',    initials: 'SR', borderColor: 'border-purple-400', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
  { id: '5', name: 'Harsh Sharma',   initials: 'HS', borderColor: 'border-green-400',  textColor: 'text-green-600',  bgColor: 'bg-green-50' },
  { id: '6', name: 'Harshita Roy',   initials: 'HR', borderColor: 'border-red-400',    textColor: 'text-red-600',    bgColor: 'bg-red-50' },
  { id: '7', name: 'Vishal Gupta',   initials: 'VG', borderColor: 'border-violet-400', textColor: 'text-violet-600', bgColor: 'bg-violet-50' },
  { id: '8', name: 'Rahul Singh',    initials: 'RS', borderColor: 'border-orange-400', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
]

const DEFAULT_OWNERS = [ALL_OWNERS[2], ALL_OWNERS[0], ALL_OWNERS[3], ALL_OWNERS[6]]

const makeDate = (year: number, month: number, day: number) => new Date(year, month - 1, day)

const LEADS = [
  'Anand Mishra', 'Sumit Jha', 'Zaheer Khan', 'Gaurav Kapoor', 'Shirish Pandey',
  'Priya Sharma', 'Rahul Verma', 'Neha Gupta', 'Amit Patel', 'Ravi Kumar',
  'Sunita Devi', 'Manish Tiwari', 'Kavita Singh', 'Deepak Joshi', 'Pooja Yadav',
  'Sandeep Mishra', 'Rekha Pandey', 'Vinod Kumar', 'Meena Agarwal', 'Suresh Gupta',
]

const ROUTES = ['DEL → DXB', 'BOM → DXB', 'DEL → SIN', 'BOM → LHR', 'DEL → BKK', 'BOM → JFK']
const TIMES  = ['09:00', '10:00', '11:00', '12:30', '14:30', '15:00', '16:00', '17:00']

function makeBooking(
  idx: number,
  overrides: Partial<Booking> = {}
): Booking {
  const services = ['Flight','Flight','Flight','Accommodation','Transportation','Limitless','Visa','Activity','Ticket','Travel Insurance','Others'] as const
  const svc = services[idx % services.length]
  const lead = LEADS[idx % LEADS.length]
  const travelDate = makeDate(2026, 3, 5 + (idx % 10))
  const bookingDate = makeDate(2026, 2, 15 + (idx % 14))
  const statuses = ['Paid','Pending','Partially Paid','Paid','Pending'] as const
  const paymentStatus = statuses[idx % statuses.length]
  const bookingStatus = idx % 8 === 0 ? 'Cancelled' : idx % 5 === 0 ? 'Draft' : 'Confirmed'
  const prefix = idx % 7 === 0 ? 'LI' : 'OS'
  const id = `${prefix}-ABC${12 + idx}`
  const ownerCount = 1 + (idx % 3)
  const ownerStart = (idx * 5) % ALL_OWNERS.length
  const owners = Array.from({ length: ownerCount }, (_, i) => ALL_OWNERS[(ownerStart + i) % ALL_OWNERS.length])
  const serviceLabels: Record<string, string> = {
    Flight: 'Flight', Accommodation: 'Accommodation', Transportation: 'Transportation',
    Limitless: ['Explore UAE', 'Bali Package', 'Thailand Tour', 'Europe Trip', 'Singapore'][idx % 5],
    Visa: 'Visa', Activity: 'Activity', Ticket: 'Ticket', 'Travel Insurance': 'Travel Insurance', Others: 'Others',
  }
  const country = svc === 'Limitless' ? ['UAE', 'Bali', 'Thailand', 'Europe', 'Singapore'][idx % 5] : undefined
  const amount = 4580 + (idx * 1234 % 90000)
  const pendingCustomer = paymentStatus === 'Paid' ? 0 : 4580
  const pendingVendor = paymentStatus === 'Paid' ? 0 : paymentStatus === 'Partially Paid' ? 2000 : 4580
  const approvalStatus: 'approved' | 'pending' | 'rejected' =
    idx % 15 === 0 ? 'pending' : idx % 20 === 0 ? 'rejected' : 'approved'

  return {
    id,
    leadPax: lead,
    travelDate,
    bookingDate,
    service: svc,
    serviceLabel: serviceLabels[svc],
    country,
    paymentStatus,
    bookingStatus,
    amount,
    pendingCustomer,
    pendingVendor,
    owners,
    hasVoucher: idx % 3 !== 2,
    taskCount: idx % 4 === 0 ? 0 : 1 + (idx % 3),
    approvalStatus,
    isDeleted: idx >= 70,
    isIncomplete: idx % 25 === 0,
    route: svc === 'Flight' ? ROUTES[idx % ROUTES.length] : undefined,
    time: TIMES[idx % TIMES.length],
    ...overrides,
  }
}

export const MOCK_BOOKINGS: Booking[] = Array.from({ length: 78 }, (_, i) => makeBooking(i))

// First 6 exactly match design screenshots
MOCK_BOOKINGS[0] = { ...MOCK_BOOKINGS[0], id: 'OS-ABC12', leadPax: 'Anand Mishra', service: 'Flight',         serviceLabel: 'Flight',         paymentStatus: 'Paid',           approvalStatus: 'approved', isDeleted: false, amount: 24580, owners: DEFAULT_OWNERS, taskCount: 1, hasVoucher: true, travelDate: makeDate(2026,3,5), bookingDate: makeDate(2026,2,15), route: 'DEL → DXB', time: '09:00' }
MOCK_BOOKINGS[1] = { ...MOCK_BOOKINGS[1], id: 'OS-ABC13', leadPax: 'Sumit Jha',    service: 'Accommodation', serviceLabel: 'Accommodation',   paymentStatus: 'Partially Paid', approvalStatus: 'approved', isDeleted: false, amount: 24580, owners: DEFAULT_OWNERS, taskCount: 1, hasVoucher: true, travelDate: makeDate(2026,3,5), bookingDate: makeDate(2026,2,15) }
MOCK_BOOKINGS[2] = { ...MOCK_BOOKINGS[2], id: 'LI-ABC12', leadPax: 'Anand Mishra', service: 'Limitless',     serviceLabel: 'Explore UAE',    paymentStatus: 'Pending',        approvalStatus: 'pending',  isDeleted: false, amount: 24580, owners: DEFAULT_OWNERS, taskCount: 1, hasVoucher: true, travelDate: makeDate(2026,3,5), bookingDate: makeDate(2026,2,15), country: 'UAE', time: '11:00' }
MOCK_BOOKINGS[3] = { ...MOCK_BOOKINGS[3], id: 'OS-ABC14', leadPax: 'Zaheer',       service: 'Transportation',serviceLabel: 'Transportation',  paymentStatus: 'Pending',        approvalStatus: 'approved', isDeleted: false, amount: 24580, owners: DEFAULT_OWNERS, taskCount: 1, hasVoucher: true, travelDate: makeDate(2026,3,5), bookingDate: makeDate(2026,2,15), time: '12:30' }
MOCK_BOOKINGS[4] = { ...MOCK_BOOKINGS[4], id: 'OS-ABC15', leadPax: 'Gaurav Kapoor',service: 'Flight',         serviceLabel: 'Flight',         paymentStatus: 'Paid',           approvalStatus: 'approved', isDeleted: false, amount: 24580, owners: DEFAULT_OWNERS, taskCount: 0, hasVoucher: true, travelDate: makeDate(2026,3,5), bookingDate: makeDate(2026,2,15), route: 'DEL → DXB', time: '09:00' }
MOCK_BOOKINGS[5] = { ...MOCK_BOOKINGS[5], id: 'OS-ABC16', leadPax: 'Shirish Pandey',service: 'Flight',        serviceLabel: 'Flight',         paymentStatus: 'Pending',        approvalStatus: 'approved', isDeleted: false, amount: 24580, owners: DEFAULT_OWNERS, taskCount: 1, hasVoucher: true, travelDate: makeDate(2026,3,5), bookingDate: makeDate(2026,2,15), route: 'DEL → DXB', time: '16:00' }

export const FINANCE_SUMMARY = {
  youGive: 70580,
  youGet: 75450,
  get net() { return this.youGet - this.youGive },
}
