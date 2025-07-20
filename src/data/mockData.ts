import { MiningConcession, DashboardStats } from '../types'

export const mockConcessions: MiningConcession[] = [
  {
    id: 'MC001',
    name: 'Golden Hills Mining',
    size: 250.5,
    owner: 'Ghana Gold Corporation',
    permitType: 'large-scale',
    permitExpiryDate: '2024-12-15',
    district: 'Tarkwa',
    region: 'Western',
    status: 'active',
    coordinates: [[-1.9973, 5.2967], [-1.9873, 5.2967], [-1.9873, 5.3067], [-1.9973, 5.3067]],
    contactInfo: {
      phone: '+233-24-123-4567',
      email: 'info@ghanagold.com',
      address: 'P.O. Box 123, Tarkwa'
    }
  },
  {
    id: 'MC002',
    name: 'Ashanti Bauxite',
    size: 180.3,
    owner: 'Bauxite Mining Ltd',
    permitType: 'large-scale',
    permitExpiryDate: '2025-06-30',
    district: 'Kumasi',
    region: 'Ashanti',
    status: 'active',
    coordinates: [[-1.6247, 6.6885], [-1.6147, 6.6885], [-1.6147, 6.6985], [-1.6247, 6.6985]]
  },
  {
    id: 'MC003',
    name: 'Northern Diamond Works',
    size: 75.8,
    owner: 'Diamond Prospectors Inc',
    permitType: 'small-scale',
    permitExpiryDate: '2024-08-20',
    district: 'Tamale',
    region: 'Northern',
    status: 'expired',
    coordinates: [[-0.8395, 9.4034], [-0.8295, 9.4034], [-0.8295, 9.4134], [-0.8395, 9.4134]]
  },
  {
    id: 'MC004',
    name: 'Eastern Granite Quarry',
    size: 120.0,
    owner: 'Granite Solutions Ghana',
    permitType: 'large-scale',
    permitExpiryDate: '2024-09-10',
    district: 'Koforidua',
    region: 'Eastern',
    status: 'active',
    coordinates: [[-0.2593, 6.0886], [-0.2493, 6.0886], [-0.2493, 6.0986], [-0.2593, 6.0986]]
  },
  {
    id: 'MC005',
    name: 'Volta Salt Mining',
    size: 95.2,
    owner: 'Salt Harvesters Co',
    permitType: 'small-scale',
    permitExpiryDate: '2025-03-15',
    district: 'Ho',
    region: 'Volta',
    status: 'active',
    coordinates: [[0.4716, 6.6109], [0.4816, 6.6109], [0.4816, 6.6209], [0.4716, 6.6209]]
  },
  {
    id: 'MC006',
    name: 'Central Gold Fields',
    size: 340.7,
    owner: 'Central Mining Enterprise',
    permitType: 'large-scale',
    permitExpiryDate: '2024-11-30',
    district: 'Cape Coast',
    region: 'Central',
    status: 'active',
    coordinates: [[-1.2471, 5.1037], [-1.2371, 5.1037], [-1.2371, 5.1137], [-1.2471, 5.1137]]
  },
  {
    id: 'MC007',
    name: 'Upper East Manganese',
    size: 210.4,
    owner: 'Manganese Mines Ltd',
    permitType: 'large-scale',
    permitExpiryDate: '2024-07-25',
    district: 'Bolgatanga',
    region: 'Upper East',
    status: 'expired',
    coordinates: [[-0.8512, 10.7856], [-0.8412, 10.7856], [-0.8412, 10.7956], [-0.8512, 10.7956]]
  },
  {
    id: 'MC008',
    name: 'Greater Accra Sand Mining',
    size: 45.6,
    owner: 'Coastal Sand Co',
    permitType: 'small-scale',
    permitExpiryDate: '2025-01-20',
    district: 'Accra',
    region: 'Greater Accra',
    status: 'active',
    coordinates: [[-0.1969, 5.6037], [-0.1869, 5.6037], [-0.1869, 5.6137], [-0.1969, 5.6137]]
  }
]

export function calculateStats(concessions: MiningConcession[]): DashboardStats {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const totalConcessions = concessions.length
  const activePermits = concessions.filter(c => c.status === 'active').length
  const expiredPermits = concessions.filter(c => c.status === 'expired').length
  const soonToExpire = concessions.filter(c => {
    const expiryDate = new Date(c.permitExpiryDate)
    return c.status === 'active' && expiryDate <= thirtyDaysFromNow && expiryDate >= now
  }).length

  const totalAreaCovered = concessions.reduce((sum, c) => sum + c.size, 0)

  const concessionsByRegion = concessions.reduce((acc, c) => {
    acc[c.region] = (acc[c.region] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const concessionsByType = concessions.reduce((acc, c) => {
    acc[c.permitType] = (acc[c.permitType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalConcessions,
    activePermits,
    expiredPermits,
    soonToExpire,
    totalAreaCovered,
    concessionsByRegion,
    concessionsByType
  }
}
