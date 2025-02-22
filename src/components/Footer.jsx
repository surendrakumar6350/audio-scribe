import React from 'react';
import { Github, Twitter, Mail, Heart, Globe, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full py-12 px-4 glass-morphism mt-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">About AudioScribe</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Transform your voice into text effortlessly. Our cutting-edge technology ensures accurate transcription for all your needs. Free now, free forever.
                        </p>
                        <div className="flex items-center gap-2 text-purple-400">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">Made with love for everyone</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Features', 'Pricing', 'Blog', 'Support'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm"
                                    >
                                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Globe className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">www.Audioscribe.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">support@Audioscribe.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">San Francisco, CA</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Newsletter</h3>
                        <p className="text-gray-400 text-sm">Stay updated with our latest features and releases.</p>
                        <form className="space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-center text-gray-400 text-sm">
                            © 2024 FreeScribe. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;