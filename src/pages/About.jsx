import React from 'react';
import { FaRoad, FaCarCrash, FaChartLine, FaMapMarkedAlt, FaUsers, FaLightbulb } from 'react-icons/fa';
import { IoMdSpeedometer } from 'react-icons/io';
import teamMembers from '../pages/team'; // You'll create this data file


const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Pothole Spotter</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Revolutionizing road maintenance through AI-powered pothole detection and smart infrastructure monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Building safer roads for everyone
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We're committed to reducing road accidents and maintenance costs by providing real-time, accurate pothole detection and analytics to cities and municipalities.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-8 lg:mb-0">
              <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">Our Technology</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Advanced AI for smarter roads
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Our system combines cutting-edge computer vision algorithms with IoT sensors to detect and classify road damage with over 95% accuracy.
              </p>
              
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-amber-500 rounded-md p-2">
                    <IoMdSpeedometer className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Real-time Processing</h4>
                    <p className="mt-1 text-gray-500">Analyzes road conditions in real-time as vehicles drive.</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-amber-500 rounded-md p-2">
                    <FaLightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Machine Learning</h4>
                    <p className="mt-1 text-gray-500">Continuously improves detection accuracy over time.</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-500 rounded-md p-2">
                    <FaMapMarkedAlt className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">GIS Integration</h4>
                    <p className="mt-1 text-gray-500">Maps potholes for efficient repair planning.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                className="w-full rounded-lg shadow-xl ring-1 ring-black ring-opacity-5" 
                src="/images/tech-dashboard.jpg" 
                alt="Pothole Spotter technology dashboard" 
              />
              <div className="mt-4 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <a
                    href="/demo"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600"
                  >
                    See our technology in action
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">Our Team</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              The people behind Pothole Spotter
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              A diverse team of engineers, data scientists, and urban planners committed to better infrastructure.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((person) => (
              <div key={person.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6 text-center">
                    <div className="flex justify-center">
                      <img
                        className="h-24 w-24 rounded-full object-cover shadow-lg"
                        src={person.imageUrl}
                        alt={person.name}
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900 tracking-tight">{person.name}</h3>
                    <p className="text-amber-600">{person.role}</p>
                    <p className="mt-3 text-base text-gray-500">
                      {person.bio}
                    </p>
                    <div className="mt-4 flex justify-center space-x-4">
                      {person.socialLinks.map((link) => (
                        <a key={link.name} href={link.url} className="text-gray-400 hover:text-amber-500">
                          <span className="sr-only">{link.name}</span>
                          <link.icon className="h-6 w-6" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to improve your city's roads?</span>
            <span className="block text-amber-400">Get started with Pothole Spotter today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600"
              >
                Contact our team
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-amber-500 bg-white hover:bg-gray-50"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature data
const features = [
  {
    name: 'Accurate Detection',
    description: 'Our AI models identify potholes with precision, reducing false positives and ensuring reliable data.',
    icon: FaRoad,
  },
  {
    name: 'Damage Prevention',
    description: 'Early detection helps prevent small cracks from developing into dangerous potholes.',
    icon: FaCarCrash,
  },
  {
    name: 'Cost Savings',
    description: 'Cities save up to 40% on road maintenance by addressing issues before they worsen.',
    icon: FaChartLine,
  },
  {
    name: 'Real-time Mapping',
    description: 'Instant updates to municipal dashboards show exactly where repairs are needed most.',
    icon: FaMapMarkedAlt,
  },
  {
    name: 'Community Engagement',
    description: 'Citizens can report issues and track repair progress through our public portal.',
    icon: FaUsers,
  },
  {
    name: 'Smart Insights',
    description: 'Predictive analytics help plan maintenance before problems become visible.',
    icon: FaLightbulb,
  },
];

export default AboutPage;