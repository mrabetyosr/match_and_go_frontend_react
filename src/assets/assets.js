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
    sideimage

}

export const companies = [
  {
    id: 1,
    name: "Sofrecom",
    logo: sofrecomlogo,
    cover: sofrecomcover,
    description: "Sofrecom is a consulting company specializing in telecommunications.",
    location: "Tunis, Tunisia",
    category: "Tech",
    jobTitle: "Frontend Developer",
    jobSlots: 3
  },
  {
    id: 2,
    name: "Medianet",
    logo: medianetlogo,
    cover: medianetcover,
    description: "Medianet focuses on digital solutions and online marketing.",
    location: "Ariana, Tunisia",
    category: "Tech",
    jobTitle: "UI/UX Designer",
    jobSlots: 2
  },
    {
    id: 3,
    name: "STB bank",
    logo: stbbanklogo,
    cover: stbbankcover,
    description: "STB Bank is a leading financial institution, providing a wide range of banking and financial services to individuals, businesses, and institutions.",
    location: "Tunis, Tunisia",
    category: "Finance / Banking",
    jobTitle: "Financial Controller",
    jobSlots: 2
  },
  {
  id: 4,
  name: "Orange Tunisie",
  logo: orangelogo,
  cover: orangecover,
  description: "Orange Tunisie is a major telecommunications company offering innovative mobile, internet, and digital services to individuals and businesses across Tunisia.",
  location: "Tunis, Tunisia",
  category: "Tech",
  jobTitle: "Network Engineer",
  jobSlots: 4
},
{
  id: 5,
  name: "Ooredoo Tunisie",
  logo: ooredoologo,
  cover: ooredoocover,
  description: "Ooredoo Tunisie is a major telecom operator known for its commitment to innovation and customer satisfaction. The company also provides business consulting services to support digital transformation and strategic growth.",
  location: "Tunis, Tunisia",
  category: "Consulting / Audit",
  jobTitle: "Business Consultant",
  jobSlots: 3
},
{
  id: 6,
  name: "Orange Tunisie",
  logo: orangelogo,
  cover: orangecover,
  description: "Orange Tunisie is a major telecommunications company offering innovative mobile, internet, and digital services to individuals and businesses across Tunisia.",
  location: "Tunis, Tunisia",
  category: "Advertising / Marketing",
  jobTitle: "Digital Marketing Specialist",
  jobSlots: 2
}
  
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