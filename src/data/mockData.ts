import { MiningConcession, DashboardStats } from '../types'
import { generateRealisticBoundary } from '../utils/geometryUtils'

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
    // Realistic concession boundary around Tarkwa area with 12 vertices
    coordinates: [
      [-1.9973, 5.2967], // Vertex 1
      [-1.9823, 5.2987], // Vertex 2
      [-1.9743, 5.2947], // Vertex 3
      [-1.9693, 5.2867], // Vertex 4
      [-1.9723, 5.2787], // Vertex 5
      [-1.9793, 5.2747], // Vertex 6
      [-1.9873, 5.2767], // Vertex 7
      [-1.9943, 5.2807], // Vertex 8
      [-1.9993, 5.2867], // Vertex 9
      [-1.9983, 5.2927], // Vertex 10
      [-1.9963, 5.2967], // Vertex 11
      [-1.9973, 5.2967]  // Close polygon
    ],
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
    // Realistic concession boundary around Kumasi area with 10 vertices
    coordinates: [
      [-1.6247, 6.6885], // Vertex 1
      [-1.6147, 6.6905], // Vertex 2
      [-1.6067, 6.6865], // Vertex 3
      [-1.6017, 6.6805], // Vertex 4
      [-1.6047, 6.6745], // Vertex 5
      [-1.6127, 6.6725], // Vertex 6
      [-1.6207, 6.6755], // Vertex 7
      [-1.6267, 6.6815], // Vertex 8
      [-1.6257, 6.6875], // Vertex 9
      [-1.6247, 6.6885]  // Close polygon
    ]
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
    // Realistic boundary around Tamale area with 8 vertices
    coordinates: [
      [-0.8395, 9.4034], // Vertex 1
      [-0.8295, 9.4054], // Vertex 2
      [-0.8245, 9.4014], // Vertex 3
      [-0.8215, 9.3954], // Vertex 4
      [-0.8255, 9.3914], // Vertex 5
      [-0.8325, 9.3934], // Vertex 6
      [-0.8375, 9.3994], // Vertex 7
      [-0.8395, 9.4034]  // Close polygon
    ]
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
