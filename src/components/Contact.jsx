
import React, { useState } from 'react';
import { useToast } from '../hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { CheckCircle2 } from 'lucide-react';

const Contact = ({ email, phone }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Google Form configuration
  const formConfig = {
    formId: "1FAIpQLSeC3604f38_BlZ34BPnATLZ8QE6wAc-TS1w_QmrzXL8KKRQ3w",
    nameEntryId: "1360294763",
    emailEntryId: "33018055",
    messageEntryId: "2000371473"
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create form data
      const formEntries = new FormData();
      formEntries.append(`entry.${formConfig.nameEntryId}`, formData.name);
      formEntries.append(`entry.${formConfig.emailEntryId}`, formData.email);
      formEntries.append(`entry.${formConfig.messageEntryId}`, formData.message);

      // Create a hidden iframe for submission
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Create a form in the iframe and submit it
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://docs.google.com/forms/d/e/${formConfig.formId}/formResponse`;
      form.target = '_blank';
      
      // Add form entries to the form
      for (let [key, value] of formEntries.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      
      iframe.contentDocument.body.appendChild(form);
      form.submit();
      
      // Reset form data and show success message
      setFormData({ name: '', email: '', message: '' });
      setIsSuccess(true);
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully. Thank you!",
      });
      
      // Clean up the iframe after submission
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            Contact Me
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out using the form below!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-2xl shadow-md">
            {isSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <AlertTitle className="text-green-800 text-lg">Message Sent Successfully!</AlertTitle>
                <AlertDescription className="text-green-700 mt-2">
                  Thank you for reaching out! I'll get back to you as soon as possible.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="label" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="label" htmlFor="email">
                    Your Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="input-field min-h-[150px]"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-2">Contact Information</h3>
                <p className="text-foreground/70">
                  Feel free to reach out through the form or using the contact details below.
                </p>
              </div>
              
              {/* Email */}
              {email && (
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-primary" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <a href={`mailto:${email}`} className="text-foreground/70 hover:text-primary transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Phone */}
              {phone && (
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-primary" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <a href={`tel:${phone}`} className="text-foreground/70 hover:text-primary transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
