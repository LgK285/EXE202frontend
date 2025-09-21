import React, { useEffect, useRef } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** ms */
  delay?: number;
  /** chỉ chạy 1 lần (mặc định true) */
  once?: boolean;
  /** ngưỡng hiển thị (0..1) */
  threshold?: number;
};

const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  once = true,
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-visible');
            if (once) io.unobserve(el);
          } else if (!once) {
            el.classList.remove('is-visible');
          }
        });
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );

    // set delay for CSS
    if (delay) {
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.setAttribute('data-delay', String(delay));
    }

    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, delay]);

  return (
    <div ref={ref} className={`reveal ${className || ''}`}>
      {children}
    </div>
  );
};

export default Reveal;
