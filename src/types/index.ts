export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending'
export type ServiceType = 'Flight' | 'Accommodation' | 'Transportation' | 'Limitless' | 'Visa' | 'Activity' | 'Ticket' | 'Travel Insurance' | 'Others'
export type ApprovalStatus = 'approved' | 'pending' | 'rejected'
export type BookingTab = 'bookings' | 'deleted' | 'waiting'
export type WaitingSubFilter = 'All' | 'Pending' | 'Approved' | 'Rejected'
export type SortDir = 'asc' | 'desc' | null
export type SortField = 'leadPax' | 'travelDate' | 'bookingDate' | 'amount' | null
export type StatusDisplayMode = 'payment' | 'booking'

export interface Owner {
  id: string
  name: string
  initials: string
  borderColor: string
  textColor: string
  bgColor: string
}

export interface Booking {
  id: string
  leadPax: string
  travelDate: Date
  bookingDate: Date
  deletedAt?: Date
  service: ServiceType
  serviceLabel: string
  country?: string
  paymentStatus: PaymentStatus
  bookingStatus: 'Confirmed' | 'Cancelled' | 'Draft'
  amount: number
  pendingCustomer: number
  pendingVendor: number
  owners: Owner[]
  hasVoucher: boolean
  taskCount: number
  approvalStatus: ApprovalStatus
  isDeleted: boolean
  isIncomplete: boolean
  route?: string
  time?: string
}

export interface FilterState {
  bookingDateStart: string
  bookingDateEnd: string
  travelDateStart: string
  travelDateEnd: string
  ownerIds: string[]
  primaryOwnerIds: string[]
  secondaryOwnerIds: string[]
  advanceOwnerSearch: boolean
  bookingType: string
  search: string
  services: ServiceType[]
  showIncomplete: boolean
}
