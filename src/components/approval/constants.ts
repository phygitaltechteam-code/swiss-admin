import {UserRequest} from '@/types/approval';

export const MOCK_REQUESTS: UserRequest[] = [
  {
    id: '892201',
    name: 'Asha Joshi',
    email: 'asha.joshi@example.com',
    caseId: '#98234',
    regDate: 'Oct 24, 2023',
    status: 'Pending',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCY21lnx8hk9RCQixJT7ZzOwtfw_pH2UODjwyMMITxIm3HBQJLDZz1OQ2K3P_BJ0Mw6sZAYrO6rAWtPq0Z5zwLwqC-8H0iE2hE0qBHXBAozVPLkjH7tVGi-ALx_xJuA_3NKdmI_96tLy6zcvyeJZCF3QYS95iwmpQD7M_1FMXuey5bdh_PrfOXncgLC-UKGRqfx3NnIswgNFvGrGHEGcUhYqTy1bSnfGjeclPlO63Ob7D91F7x9YtwoTZt-Dx4OM5sNIl7AGcQW716n',
    address: '123 Fintech Lane, Bandra, Mumbai',
    docName: 'National Passport',
    docNumber: 'P45892201',
    docImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvhLcuPm4S_DEpKGGnbXgTpW-mWY-UhEx2VBMNtxWSyOsI3funhEyrGBQM6d6LN5k39v1zOAN6HNV60rcqd76vxju71Wl6lqZM2yHt9DY9ZYqL4dUEOw2NcMTn3XudIfzp-VS55fzgm-zLYQybn66ODlsDDy0T0p2m29EC31Eu3mM8ae3pwBZGM3VTVpjluDT5kVrTb0tI4Yh323N7jqu6sZ30unhedWCm7pCljHkTnGQwrkCjl5CWnVnKsf7bQdt0HtHLH9SbRT2Y',
    needsReview: true,
  },
  {
    id: '892156',
    name: 'John Doe',
    email: 'john.doe@example.com',
    caseId: '#98235',
    regDate: 'Oct 23, 2023',
    status: 'Pending',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDhTufDwIEX_s9We_-Fg7_5G4iCRGzDMhdMYw6cSdtXguncginWtCF6reeiBven9QK3eZGmolP-vx6qXmVWfZI6C3SKT8qfIbxDYbcS2uBkkBI4Lz1FKK_JAVk53BIteokZcoWJnF5oMQq5jKU5ynho3jjgugRJrdo-NZCsPZggsh2c6l8A1wEd8inIcgAVyxSzej9y8xWCbqiWSVTVy--zl81beR6K0L2xMqOHUSI2wwdmfULlFyZWGoMZ6zSg5dkq0bAYdDUbPAb',
    address: '456 Tech Park, Bangalore',
    docName: 'Driving License',
    docNumber: 'DL-98237123',
    docImageUrl: 'https://picsum.photos/400/300',
    assignedToYou: true,
  },
  {
    id: '891998',
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    caseId: '#98230',
    regDate: 'Oct 22, 2023',
    status: 'Rejected',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYRb2HOuY6K-_wielE4ateEQUMq3fviVFiPIPA0JRn32V3bKG9lnp43qrWrQaWAF419zVixlSqcK8pfDmNtJ1ih6vUYs9KJ3MjSqHRWJLKn9EvXu3aYWwXAP3HHhTKclnSnYXLNfMSuSe2QqsbSMm-S6LsGy9a5wwQ_rPBAeATQaSOkL_4nt1SgxlozFR81MvNan2CbBQrmqhY7PgesAI-muh256afRqU0khIsGPscjQN9VTF_QeWq49O0zAW3d4hzF48-aoNlDJvh',
    address: '789 Elm Street, Delhi',
    docName: 'Aadhar Card',
    docNumber: '1234-5678-9012',
    docImageUrl: 'https://picsum.photos/400/300',
    rejectionReason:
      'Identification document provided was blurred and details were not legible. Please re-upload a clear copy.',
  },
  {
    id: '891822',
    name: 'Michael King',
    email: 'michael.king@example.com',
    caseId: '#98222',
    regDate: 'Oct 21, 2023',
    status: 'Approved',
    avatarUrl: '', // Will use initial fallback
    address: '321 Pine Avenue, Pune',
    docName: 'Passport',
    docNumber: 'P98123123',
    docImageUrl: 'https://picsum.photos/400/300',
  },
];
