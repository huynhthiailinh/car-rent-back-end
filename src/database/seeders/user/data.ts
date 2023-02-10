import { IUser } from '@modules/users/interfaces/user.interface';

export const users: IUser[] = [
  {
    email: 'info@akpol.ac.id',
    hashedPassword:
      '$2b$10$CbNojZ2ojyjq2kvoNtHf6eMNryCjWsAK2yfqqnI32LlADV1NLnm/S',
    fullName: 'Alex Stanton',
    phoneNumber: '024841168090',
    address: 'Jl. Sultan Agung No 131 Candi Baru Semarang',
    cityId: 3,
    occupation: 'CEO at Bukalapak',
    verifiedAt: new Date('2023-01-09 06:03:00'),
    tokens: [],
    orders: [],
    images: [],
    favourites: [],
  },

  {
    email: 'cs-reply@amazon.com',
    hashedPassword:
      '$2b$10$5uIjL9XFcOIHUN3Jdzba7.z9n940O9Y4Kh7EPakBMP4m9qKtaOrLu',
    fullName: 'Skylar Dias',
    phoneNumber: '18882804331',
    address: '410 Terry Ave N, Seattle 98109, WA',
    cityId: 1,
    occupation: 'CEO at Amazon',
    verifiedAt: new Date('2023-01-09 06:04:12'),
    tokens: [],
    orders: [],
    images: [],
    favourites: [],
  },
];
