"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/logo.jpeg" 
                alt="E-OPROGEM Logo" 
                width={32} 
                height={32} 
                className="rounded-lg"
              />
              <h3 className="text-lg font-bold text-blue-600">E-OPROGEM</h3>
            </div>
            <p className="text-sm leading-relaxed">
              A secure government-approved platform for filing and tracking sensitive complaints with complete confidentiality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-blue-600 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#how-to-file" className="hover:text-blue-600">How to File Complaint</a></li>
              <li><a href="#track-case" className="hover:text-blue-600">Track Your Case</a></li>
              <li><a href="#emergency" className="hover:text-blue-600">Emergency Contacts</a></li>
              <li><a href="#legal" className="hover:text-blue-600">Legal Resources</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-blue-600 mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>1800-123-4567 (24/7 Helpline)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>support@securecase.gov</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Police Headquarters, State Capital</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>24/7 Online Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} SecureCase. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="#privacy" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#terms" className="hover:text-blue-600">Terms of Service</a>
            <a href="#accessibility" className="hover:text-blue-600">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
