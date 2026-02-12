export type UserRecord = {
  id: number
  name: string
  role: string
  location: string
  joinedAt: string
}

export const users: UserRecord[] = [
  {
    id: 1,
    name: 'Yassine Belkacem',
    role: 'Cloud Engineer',
    location: 'Paris, FR',
    joinedAt: '2024-02-01T09:00:00.000Z',
  },
  {
    id: 2,
    name: 'Lina Chen',
    role: 'Product Manager',
    location: 'Toronto, CA',
    joinedAt: '2023-10-12T09:00:00.000Z',
  },
  {
    id: 3,
    name: 'Marcus Silva',
    role: 'SRE',
    location: 'Lisbon, PT',
    joinedAt: '2025-03-05T09:00:00.000Z',
  },
  {
    id: 4,
    name: 'Aïcha Diallo',
    role: 'Data Lead',
    location: 'Dakar, SN',
    joinedAt: '2022-07-22T09:00:00.000Z',
  },
  {
    id: 5,
    name: 'Sophie Dubois',
    role: 'UX Designer',
    location: 'Lyon, FR',
    joinedAt: '2026-02-12T10:00:00.000Z',
  },
]
