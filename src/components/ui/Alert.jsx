// components/ui/alert.jsx
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  X,
  Bell 
} from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-red-50 dark:bg-red-900/10",
        success:
          "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-600 bg-green-50 dark:bg-green-900/10",
        warning:
          "border-yellow-500/50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10",
        info:
          "border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-600 bg-blue-50 dark:bg-blue-900/10",
        notification:
          "border-purple-500/50 text-purple-700 dark:border-purple-500 [&>svg]:text-purple-600 bg-purple-50 dark:bg-purple-900/10",
      },
      position: {
        default: "relative",
        "top-right": "fixed top-4 right-4",
        "top-left": "fixed top-4 left-4",
        "bottom-right": "fixed bottom-4 right-4",
        "bottom-left": "fixed bottom-4 left-4",
      },
      size: {
        default: "w-full",
        sm: "w-72",
        lg: "w-96",
      }
    },
    defaultVariants: {
      variant: "default",
      position: "default",
      size: "default",
    },
  }
);

const iconMap = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  notification: Bell,
};

const AlertContext = React.createContext({
  variant: "default",
  onClose: null,
});

const Alert = React.forwardRef(({ 
  className, 
  variant = "default", 
  position = "default",
  size = "default",
  children, 
  open = true,
  onClose,
  autoClose = false,
  autoCloseDuration = 5000,
  ...props 
}, ref) => {
  const [isVisible, setIsVisible] = React.useState(open);
  const Icon = iconMap[variant];

  React.useEffect(() => {
    setIsVisible(open);
  }, [open]);

  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, isVisible, onClose]);

  const animationVariants = {
    initial: { 
      opacity: 0, 
      y: position.includes('top') ? -20 : 20,
      x: position.includes('right') ? 20 : position.includes('left') ? -20 : 0 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      x: 0 
    },
    exit: { 
      opacity: 0, 
      y: position.includes('top') ? -20 : 20,
      x: position.includes('right') ? 20 : position.includes('left') ? -20 : 0 
    }
  };

  return (
    <AlertContext.Provider value={{ variant, onClose }}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            role="alert"
            className={cn(alertVariants({ variant, position, size }), className)}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
            transition={{ duration: 0.2 }}
            {...props}
          >
            <Icon className="h-4 w-4" />
            {onClose && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  onClose?.();
                }}
                className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { variant } = React.useContext(AlertContext);
  return (
    <h5
      ref={ref}
      className={cn(
        "mb-1 font-medium leading-none tracking-tight",
        variant === "destructive" && "text-red-900 dark:text-red-200",
        className
      )}
      {...props}
    />
  );
});
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { variant } = React.useContext(AlertContext);
  return (
    <div
      ref={ref}
      className={cn(
        "text-sm [&_p]:leading-relaxed",
        variant === "destructive" && "text-red-800 dark:text-red-200",
        className
      )}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };