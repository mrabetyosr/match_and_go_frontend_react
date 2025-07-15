import namelogo from './namelogo.png';
import headervideo1 from './headervideo1.mp4';
import headervideo2 from './headervideo2.mp4';
import sofrecomlogo from './sofrecomlogo.png';
import sofrecomcover from './sofrecomcover.jpg';
import medianetlogo from './medianet.png';
import medianetcover from './medianetcover.jpg';


export const assets = {
    namelogo,
    headervideo1,
    headervideo2
}

export const companies = [
  {
    id: 1,
    name: "Sofrecom",
    logo: sofrecomlogo,
    cover: sofrecomcover,
    description: "Sofrecom is a consulting company specializing in telecommunications.",
    location: "Tunis, Tunisia",
    category: "Engineering / Construction",
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
  }
  
  ];