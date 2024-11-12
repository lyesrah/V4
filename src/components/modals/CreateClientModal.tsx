// Previous content remains the same, but update the success callback:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  try {
    const missingFields = formFields
      .filter(field => field.required && !formData[field.id]);

    if (missingFields.length > 0) {
      throw new Error(currentLanguage === 'fr' 
        ? 'Veuillez remplir tous les champs obligatoires' 
        : 'Please fill in all required fields'
      );
    }

    const newClient = await addClient(formData);
    setShowSuccess(true);
    
    // Increase timeout to ensure proper state updates
    setTimeout(() => {
      setFormData({});
      onCreate(newClient);
    }, 2000);
    
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
    setIsSubmitting(false);
  }
};