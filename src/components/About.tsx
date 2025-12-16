'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function About() {
    return (
        <section className="py-20 relative overflow-hidden bg-black/20">
            <div className="container px-4 mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Decorative Quote Icon */}
                    <div className="absolute -top-10 -left-6 opacity-10">
                        <Quote className="w-24 h-24 text-amber-500 rotate-180" />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-12 backdrop-blur-sm relative z-10">
                        <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-amber-100 font-malayalam">
                            ആത്മഗീതം
                        </h2>

                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="text-base md:text-xl leading-relaxed text-justify md:text-center text-muted-foreground font-malayalam">
                                "ആത്മീയതയിലേക്ക് നയിക്കുന്ന വ്യത്യസ്ത കാവ്യശകലങ്ങൾ ഉൾക്കൊള്ളിച്ചു അവതരിപ്പിക്കുന്ന രീതിയാണ് ആത്മഗീതം. സലാം ബൈത്തിൽ തുടങ്ങി, 
                                തുടർന്ന് ഒരു ഭക്തിഗാനവും ഒരു സൂഫി ആദ്ധ്യാത്മിക ഗാനവും ഉൾപ്പെടുത്തി അവതരിപ്പിക്കുകയാണ് ഉദ്ദേശ്യം. വെള്ള വസ്ത്രം ധരിച്ച്, 
                                മജ്‌ലിസ് രൂപത്തിൽ ഇരുന്ന്, 5 പേരടങ്ങുന്ന മുഴുവൻ ടീം അംഗങ്ങളും പാടിയും ലയിച്ചും, 
                                ഒരു മേൽപാട്ടുകാരന്റെ കീഴിലായി അവതരണം നടത്തണം. സൂഫി ഗാനത്തിന്റെ രചയിതാവിനെ 
                                നിർബന്ധമായും പറയേണ്ടതാണ്. സൂഫി ഗാനത്തിന് മലയാളമല്ലാത്ത ഭാഷ അനുവദനീയമല്ല. 
                                ഒന്നിൽ നിന്നും മറ്റൊന്നിലേക്ക് തുടർച്ച ആവശ്യമായ രീതിയിൽ ഇതിവൃത്തം ഐക്യപ്പെടാൻ 
                                സൂക്ഷിക്കുന്നത് ഏറെ ഭംഗിയാകും. സലാം ബൈത്തിന് ശേഷം നിർത്തി, ഭക്തിഗാനവും 
                                തുടർന്ന് സൂഫി ഗാനവും വേർതിരിച്ച് അവതരിപ്പിക്കുന്നത് വ്യക്തതയ്ക്കു ഫലം ചെയ്യും."
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
