
import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First, store the submission in Supabase
      const { error: supabaseError } = await supabase
        .from('form_submissions')
        .insert({
          form_type: 'contact',
          submission_data: {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            submitted_at: new Date().toISOString(),
          },
        });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      // Using FormSubmit service as a backup to send emails - it's a simple service that forwards form submissions via email
      const response = await fetch('https://formsubmit.co/rushiwankhede0503@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: 'New Contact Form Submission - AIAdmaxify',
        }),
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error('Something went wrong with the form submission');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError('Something went wrong. Please try again or email us directly.');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitError('');
      }, 5000);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
      
      {submitSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          Thank you! Your message has been sent successfully. We'll be in touch soon.
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agency-purple"
            required
          />
        </div>
        
        <div className="relative">
          <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agency-purple"
            required
          />
        </div>
        
        <div className="relative">
          <MessageSquare size={20} className="absolute left-3 top-3 text-gray-400" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agency-purple"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="agency-btn w-full flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Send Message
            </>
          )}
        </button>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">Need immediate assistance?</p>
          <a 
            href="/book-strategy-call" 
            target="_blank" 
            rel="noopener noreferrer"
            className="agency-btn mt-3 inline-block"
          >
            Book a Free Strategy Call
          </a>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
