'use client'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import crypto from 'crypto';



export default function ChangePassword() {
    const router = useRouter()
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Les mots de passe ne correspondent pas.';
    }

    // Add more validation as needed
    
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  const hashPassword = (password) => {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY; // Ensure SECRET_KEY is in your .env file
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
};


  const handleSubmit = async(e) => {
    e.preventDefault();

    if (validateForm()) {
      // Submit the form data to your API or handle it as needed
      try {
        let mot_pass = hashPassword(formData.new_password); // Hash the new password
        await fetch('/api/updatedata', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idField: 'code_user',
                id: session.user.id,
                table: 'user',
                data: {mot_pass}
            })
        });
        if(session?.user?.admin){
            router.push('/manageusers');
        }else{
            router.push('/facture');
        }
         // Redirect to a success page or dashboard
    } catch (error) {
        console.error('Error creating user:', error);
    }
      console.log('Form submitted:', formData);
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-secondary mb-4">Changer le Mot de Passe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="new_password" className="block text-lg font-medium text-gray-900">Nouveau Mot de Passe</label>
            <input
              type={showPassword ? "text" : "password"}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
            />
            {errors.new_password && <p className="text-red-600 text-sm mt-1">{errors.new_password}</p>}
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-lg font-medium text-gray-900">Confirmer le Nouveau Mot de Passe</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm text-base focus:ring-2 focus:ring-secondary"
            />
            {errors.confirm_password && <p className="text-red-600 text-sm mt-1">{errors.confirm_password}</p>}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show_password"
              checked={showPassword}
              onChange={togglePasswordVisibility}
              className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded"
            />
            <label htmlFor="show_password" className="ml-2 block text-sm text-gray-900">
              Afficher les mots de passe
            </label>
          </div>
          <button type="submit" className="block mx-auto mt-6 bg-primary text-white py-2 px-6 rounded text-base">
            Changer le Mot de Passe
          </button>
        </form>
      </div>
    </div>
  );
}
