import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Steven Muiruri',
    role: 'Founder & CEO',
    imageUrl: '/images/team/steven.jpg',
    bio: 'Urban planning specialist with 10+ years experience in municipal infrastructure projects.',
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com', icon: FaTwitter },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: FaLinkedin },
    ],
  },
  {
    name: 'Alex Johnson',
    role: 'Lead Data Scientist',
    imageUrl: '/images/team/alex.jpg',
    bio: 'Machine learning expert focused on computer vision applications for urban environments.',
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com', icon: FaGithub },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: FaLinkedin },
    ],
  },
  {
    name: 'Maria Garcia',
    role: 'Head of Engineering',
    imageUrl: '/images/team/maria.jpg',
    bio: 'Full-stack developer specializing in geospatial applications and IoT systems.',
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com', icon: FaGithub },
      { name: 'Twitter', url: 'https://twitter.com', icon: FaTwitter },
    ],
  },
];

export default teamMembers;