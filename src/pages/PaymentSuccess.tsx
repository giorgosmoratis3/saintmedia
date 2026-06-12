import PageLayout from "@/components/PageLayout";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/language-context";

const PaymentSuccess = () => {
  const { language } = useLanguage();
  const isGreek = language === "el";

  return (
    <PageLayout>
      <section className="section-padding min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-background mb-4">
            {isGreek ? "Η πληρωμή ολοκληρώθηκε!" : "Payment Successful!"}
          </h1>
          <p className="text-background/60 mb-8">
            {isGreek
              ? "Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σας σύντομα."
              : "Thank you! We'll be in touch shortly."}
          </p>
          <Link to="/">
            <Button variant="glass" size="lg">
              {isGreek ? "Επιστροφή στην αρχική" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default PaymentSuccess;
