import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Settings,
  Check,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function SettingsManager() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    org_name: 'Mariya Nuuman Foundation',
    tagline: 'Empowering Communities, Nurturing Education & Building Self-Reliance',
    mission: '',
    vision: '',
    contact_phone: '',
    contact_email: '',
    contact_whatsapp: '',
    office_address: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    youtube_url: ''
  });

  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: () => api.get('/settings')
  });

  useEffect(() => {
    if (data?.data) {
      setForm(prev => ({
        ...prev,
        ...data.data
      }));
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/settings', form);
      addToast('Foundation settings saved successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div>
        <h2 className="text-2xl font-bold font-display text-slate-900">
          Organization & Site Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure official foundation metadata, mission statements, contact info, and social channels.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6 text-xs">
        
        {/* General Brand Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-display text-slate-900 border-b pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-900" />
            Brand & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                name="org_name"
                value={form.org_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline / Motto</label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mission Statement</label>
            <textarea
              rows="2"
              name="mission"
              value={form.mission}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Vision Statement</label>
            <textarea
              rows="2"
              name="vision"
              value={form.vision}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-display text-slate-900 border-b pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-900" />
            Contact & Secretariat Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Line</label>
              <input
                type="text"
                name="contact_whatsapp"
                value={form.contact_whatsapp}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Office / Physical Address</label>
            <input
              type="text"
              name="office_address"
              value={form.office_address}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-display text-slate-900 border-b pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-900" />
            Social Media Handles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebook_url"
                value={form.facebook_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={form.instagram_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Site Settings
          </button>
        </div>

      </form>

    </div>
  );
}
