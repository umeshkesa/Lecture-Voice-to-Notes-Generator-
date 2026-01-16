import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  delay?: number;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  iconBg,
  delay = 0 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="h-full bg-white rounded-xl p-8 border border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 ">
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-slate-900">
          {title}
        </h3>
        
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}


