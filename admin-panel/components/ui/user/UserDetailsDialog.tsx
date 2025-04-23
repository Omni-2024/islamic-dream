import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Mail, MapPin, Globe, Phone, Clock, Languages, Briefcase, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {getCountryLabel, getLanguageLabel} from "@/lib/utils";
import {UserDto} from "@/contexts/AuthContexts";



const TutorDetailsDialog = ({ tutor }: {tutor:UserDto}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <Eye className="h-4 w-4 text-gray-600 hover:text-gray-900" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] overflow-hidden p-0">
                <div className="relative bg-gradient-to-r from-primary-700 to-primary-400 p-6 text-white">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-white mb-2">
                                {tutor.name}
                            </DialogTitle>
                            <div className="flex items-center space-x-2 text-blue-100">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm">{tutor.email}</span>
                            </div>
                        </DialogHeader>
                    </div>
                </div>

                <ScrollArea className="max-h-[60vh]">
                    <div className="p-6 space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg animate-in fade-in duration-500">
                            {/*<div className="flex items-center space-x-3">*/}
                            {/*    <div className="p-2 bg-blue-100 rounded-lg">*/}
                            {/*        <Briefcase className="h-5 w-5 text-blue-600" />*/}
                            {/*    </div>*/}
                            {/*    <div>*/}
                            {/*        <p className="text-sm text-gray-500">Experience</p>*/}
                            {/*        <p className="font-medium">{tutor.yearOfExperience} years</p>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Age</p>
                                    <p className="font-medium">{tutor.age} years</p>
                                </div>
                            </div>
                        </div>

                        {/* Location & Time */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Location & Availability</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{getCountryLabel(tutor.country)}</p>
                                        <p className="text-xs text-gray-500">Location</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 border  bg-white rounded-lg">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Contact Number</p>
                                        <p className="font-medium text-gray-900">{tutor.mobileNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Globe className="h-5 w-5 text-gray-500" />
                                <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tutor.languages.map((language) => (
                                    <Badge
                                        key={language}
                                        variant="secondary"
                                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 border border-gray-200 animate-in fade-in duration-300"
                                    >
                                        {getLanguageLabel(language)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default TutorDetailsDialog;