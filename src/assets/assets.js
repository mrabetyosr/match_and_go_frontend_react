import namelogo from './namelogo.png';
import headervideo1 from './headervideo1.mp4';
import headervideo2 from './headervideo2.mp4';
import sofrecomlogo from './sofrecomlogo.png';
import sofrecomcover from './sofrecomcover.jpg';
import medianetlogo from './medianet.png';
import medianetcover from './medianetcover.jpg';
import stbbanklogo from './stbbanklogo.png';
import stbbankcover from './stbbankcover.jpg';
import orangelogo from './orangelogo.png';
import orangecover from './orangecover.jpg';
import ooredoologo from './ooredoologo.jpeg';
import ooredoocover from './ooredoocover.jpeg';

import jobsection2 from './2.png';
import jobsection3 from './3.png';
import findjob from './findjob.png';
import candidaturesection from './candidatureSection.png';
import findjob1 from './findjob1.png';
import test from './test.png';

import claraPhoto from './user1.avif';
import yassinePhoto from './user2.avif';
import fatimaPhoto from './user3.avif';
import leoPhoto from './user4.jpg';
import amiraPhoto from './user5.jpg';
import matchgorforum from './matchgorforum.png';
import sideimage from './sideimage.jpg'
import GetFound from './GetFound.png';




export const assets = {
    namelogo,
    headervideo1,
    headervideo2,
    jobsection2,
    jobsection3,
    findjob,
    candidaturesection,
    findjob1,
    test,
    matchgorforum,
    sideimage,
    GetFound

}
export const companies = [
  {
    id: 1,
    name: "Orange Tunisie",
    logo: orangelogo,
    cover: orangecover,
    description: "Orange Tunisie is a major telecommunications company offering innovative mobile, internet, and digital services to individuals and businesses across Tunisia.",
    location: "Tunis, Tunisia",
    category: "Tech"
  },
  {
    id: 2,
    name: "Sofrecom",
    logo: sofrecomlogo,
    cover: sofrecomcover,
    description: "Sofrecom is a consulting company specializing in telecommunications.",
    location: "Tunis, Tunisia",
    category: "Tech"
  },
  // ...other companies
];
export const jobs = [
  {
    id: 1,
    companyId: 1, // Orange Tunisie
    jobTitle: "Network Engineer",
    jobType: "Full-time",
    jobSalary: 3500,
    jobSlots: 4,
    jobDate: "2025-07-15"
  },
  {
    id: 2,
    companyId: 1, // Orange Tunisie
    jobTitle: "Digital Marketing Specialist",
    jobType: "Internship",
    jobSalary: 1200,
    jobSlots: 2,
    jobDate: "2025-07-20"
  },
  {
    id: 3,
    companyId: 2, // Sofrecom
    jobTitle: "Frontend Developer",
    jobType: "Full-time",
    jobSalary: 3000,
    jobSlots: 3,
    jobDate: "2025-07-26"
  },
  // ...other jobs
];


export const forumPosts = [
  {
    id: 1,
    firstName: 'Yosr',
    lastName: 'Mrabet',
    userPhoto: claraPhoto,
    role: 'Tech Recruiter - Google',
    content: 'We’re hiring junior full-stack devs 🚀! Drop your CVs!',
    likes: 120,
    comments: 45,
  },
  {
    id: 2,
    firstName: 'Ali',
    lastName: 'Ben Salah',
    userPhoto: yassinePhoto,
    role: 'HR Manager - Orange',
    content: 'Great CVs coming from Tunisia 🇹🇳 this year! Keep it up.',
    likes: 98,
    comments: 34,
  },
  {
    id: 3,
    firstName: 'Julie',
    lastName: 'Moreau',
    userPhoto: fatimaPhoto,
    role: 'Talent Acquisition - Capgemini',
    content: 'Looking for fresh UI/UX designers for freelance projects 💼.',
    likes: 87,
    comments: 28,
  },
  {
    id: 4,
    firstName: 'Omar',
    lastName: 'Guesmi',
    userPhoto: leoPhoto,
    role: 'Lead Recruiter - DevCore',
    content: 'Thanks to everyone who applied! You’re amazing 🔥.',
    likes: 75,
    comments: 20,
  },
  {
    id: 5,
    firstName: 'Lina',
    lastName: 'Kacem',
    userPhoto: amiraPhoto,
    role: 'Recruiter - Ubisoft',
    content: 'Game developer positions now open 🎮! DM me for details.',
    likes: 68,
    comments: 19,
  },
];