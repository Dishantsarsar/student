import React, { useState } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Play } from 'lucide-react';
import CheckoutModal from '../../components/checkout/CheckoutModal';
import PaymentSuccess from '../../components/checkout/PaymentSuccess';

function CourseCatalogView() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    { id: 1, title: 'Advanced React Patterns', level: 'Advanced', progress: 0, price: 4999 },
    { id: 2, title: 'Fullstack Next.js', level: 'Intermediate', progress: 45, price: 5999 },
    { id: 3, title: 'UI/UX Design Systems', level: 'Beginner', progress: 100, price: 2999 },
  ];

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setCheckoutOpen(true);
  };

  const handlePaymentSuccess = () => {
    setCheckoutOpen(false);
    setSuccessOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>Course Catalog</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>Explore and enroll in premium courses.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        {courses.map(course => (
          <GlassCard key={course.id} hover variant="interactive">
            <Badge variant={course.progress === 100 ? 'success' : 'info'} style={{ marginBottom: 'var(--space-4)' }}>
              {course.level}
            </Badge>
            <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-2)' }}>{course.title}</h3>
            <div style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
              Learn the industry standard techniques used by top professionals.
            </div>
            {course.progress > 0 ? (
              <Button fullWidth icon={<Play size={16} />}>
                {course.progress === 100 ? 'Review Course' : 'Continue'}
              </Button>
            ) : (
              <Button fullWidth onClick={() => handleEnroll(course)}>
                Enroll - ₹{course.price}
              </Button>
            )}
          </GlassCard>
        ))}
      </div>

      {selectedCourse && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setCheckoutOpen(false)} 
          onSuccess={handlePaymentSuccess}
          amount={selectedCourse.price}
        />
      )}
      <PaymentSuccess 
        isOpen={isSuccessOpen} 
        onClose={() => setSuccessOpen(false)} 
        onContinue={() => setSuccessOpen(false)} 
      />
    </div>
  );
}

export default CourseCatalogView;
