document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', '-translate-y-4');
        mobileMenu.classList.add('opacity-100', 'translate-y-0');
      }, 10);
    });

    const hideMobileMenu = () => {
      mobileMenu.classList.remove('opacity-100', 'translate-y-0');
      mobileMenu.classList.add('opacity-0', '-translate-y-4');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    };

    if (closeMobileMenu) {
      closeMobileMenu.addEventListener('click', hideMobileMenu);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', hideMobileMenu);
    });
  }

  // 2. Sticky Navbar Glass Effect on Scroll
  const mainNavbar = document.getElementById('mainNavbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainNavbar.classList.add('shadow-md', 'bg-white/95');
      mainNavbar.classList.remove('bg-white/80');
    } else {
      mainNavbar.classList.remove('shadow-md', 'bg-white/95');
      mainNavbar.classList.add('bg-white/80');
    }
  });

  // 3. Modal Agendamento VIP
  const appointmentModal = document.getElementById('appointmentModal');
  const openModalButtons = document.querySelectorAll('[data-open-modal="appointment"]');
  const closeModalButtons = document.querySelectorAll('[data-close-modal="appointment"]');

  const openModal = () => {
    if (appointmentModal) {
      appointmentModal.classList.remove('hidden');
      setTimeout(() => {
        appointmentModal.classList.remove('opacity-0');
        appointmentModal.querySelector('.modal-card')?.classList.remove('scale-95');
        appointmentModal.querySelector('.modal-card')?.classList.add('scale-100');
      }, 10);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (appointmentModal) {
      appointmentModal.classList.add('opacity-0');
      appointmentModal.querySelector('.modal-card')?.classList.remove('scale-100');
      appointmentModal.querySelector('.modal-card')?.classList.add('scale-95');
      setTimeout(() => {
        appointmentModal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }
  };

  openModalButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));

  if (appointmentModal) {
    appointmentModal.addEventListener('click', (e) => {
      if (e.target === appointmentModal) {
        closeModal();
      }
    });
  }

  // 4. Interactive FAQ Accordion
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector('.accordion-icon');
      const isCurrentlyOpen = content.classList.contains('active');

      // Close all accordions in the group
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('active'));

      if (!isCurrentlyOpen) {
        content.classList.add('active');
        if (icon) icon.classList.add('active');
      }
    });
  });

  // 5. Phone Input Mask (Brazilian (XX) XXXXX-XXXX format)
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        e.target.value = `(${value}`;
      }
    });
  });

  // 6. Web3Forms Submission Handlers (Footer and Modal)
  const handleFormSubmit = (formId, successId) => {
    const form = document.getElementById(formId);
    const successMsg = document.getElementById(successId);

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enviando solicitação...
        `;

        const formData = new FormData(form);

        try {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
          });

          const result = await response.json();

          if (response.status === 200 && result.success) {
            form.reset();

            if (successMsg) {
              successMsg.classList.remove('hidden');
              setTimeout(() => {
                successMsg.classList.add('hidden');
              }, 8000);
            }

            showGlobalToast("Solicitação enviada com sucesso! Nossa concierge entrará em contato em instantes.");

            if (formId === 'modalConsultationForm') {
              setTimeout(closeModal, 2000);
            }
          } else {
            showGlobalToast(result.message || "Ocorreu um erro ao enviar. Tente novamente ou nos chame no WhatsApp.");
          }
        } catch (error) {
          console.error("Web3Forms Submission Error:", error);
          showGlobalToast("Erro de conexão. Por favor, utilize o botão de WhatsApp.");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    }
  };

  handleFormSubmit('footerContactForm', 'footerFormSuccess');
  handleFormSubmit('modalConsultationForm', 'modalFormSuccess');

  // 7. Global Toast Notification
  function showGlobalToast(message) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'fixed bottom-6 right-6 z-50 bg-[#141619] text-white border border-[#C5A059] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all duration-300 transform translate-y-20 opacity-0';
      toast.innerHTML = `
        <span class="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E0C17B]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </span>
        <span class="text-sm font-medium pr-2 text-stone-100" id="toastMessage">${message}</span>
      `;
      document.body.appendChild(toast);
    } else {
      document.getElementById('toastMessage').textContent = message;
    }

    setTimeout(() => {
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 5000);
  }
});
