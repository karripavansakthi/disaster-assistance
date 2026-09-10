import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getResources, createEmergencyRequest, addNotification } from '../data/mockData';
import {
  Utensils,
  HeartPulse,
  Droplet,
  Package,
  MapPin,
  Clock,
  Eye,
  X,
  Phone,
  PlusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Resources() {
  const [allResources, setAllResources] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestItemType, setRequestItemType] = useState('Food Ration Kit');
  const [requestQuantity, setRequestQuantity] = useState(2);
  const [requestAddress, setRequestAddress] = useState('Current GPS Location');
  const [requestSuccessMsg, setRequestSuccessMsg] = useState('');

  const loadResources = () => {
    setAllResources(getResources());
  };

  useEffect(() => {
    loadResources();
    window.addEventListener('da_data_updated', loadResources);
    return () => window.removeEventListener('da_data_updated', loadResources);
  }, []);

  const tabs = [
    { id: 'All', label: 'All Supplies', icon: Package },
    { id: 'Food', label: 'Food & Meals', icon: Utensils },
    { id: 'Medical', label: 'Medical & First Aid', icon: HeartPulse },
    { id: 'Water', label: 'Clean Water', icon: Droplet },
    { id: 'Others', label: 'Blankets & Tarps', icon: Package }
  ];

  const filteredResources = allResources.filter(
    (res) => activeTab === 'All' || res.category.toLowerCase() === activeTab.toLowerCase()
  );

  const handleCreateResourceRequest = (e) => {
    e.preventDefault();
    createEmergencyRequest({
      type: requestItemType.includes('Medical') ? 'Medical' : 'Food',
      name: 'Community Requester',
      peopleAffected: requestQuantity * 2,
      location: requestAddress,
      details: `Urgent supply allocation request: ${requestQuantity}x ${requestItemType}`,
      requiredAssistance: [requestItemType.includes('Medical') ? 'Medical' : 'Food']
    });

    addNotification({
      type: 'resource',
      title: 'Resource Supply Dispatched',
      message: `${requestQuantity}x ${requestItemType} requisition approved for delivery.`,
      link: '/victim/dashboard'
    });

    setRequestSuccessMsg(`Requisition submitted! ${requestQuantity}x ${requestItemType} queued for dispatch.`);
    setTimeout(() => {
      setRequestSuccessMsg('');
      setRequestModalOpen(false);
    }, 1800);
  };

  return (
    <DashboardLayout
      title="Relief Food, Water & Medical Supplies"
      subtitle="Track verified community distribution centers, available ration inventory, and request essential kits"
      roleOverride="victim"
    >
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        {/* Top Action & Notice Bar */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4EAF2] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-[#172B4D]">Central Relief Supply Inventory</h2>
            <p className="text-xs text-[#667085] mt-0.5">
              All listed supplies are provided free of cost by Disaster Management Authorities and verified NGOs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRequestModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request Specific Supplies</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#062B4C] text-white shadow-sm'
                    : 'bg-white border border-[#E4EAF2] text-[#667085] hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Resource Cards List */}
        <div className="space-y-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-[#E4EAF2] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-extrabold text-[#172B4D]">{res.name}</h3>
                    <span className="text-xs font-bold text-[#1268E8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {res.distance}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>

                  <p className="text-xs text-[#667085] mt-1.5 font-medium">
                    {res.items}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-500" /> {res.timings}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-600">{res.provider}</span>
                  </div>
                </div>
              </div>

              {/* Status & View Details button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <StatusBadge status={res.status} />

                <button
                  type="button"
                  onClick={() => setSelectedResource(res)}
                  className="px-4 py-2 rounded-xl border border-[#E4EAF2] hover:border-[#1268E8] text-xs font-bold text-[#1268E8] hover:bg-blue-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#172B4D]">{selectedResource.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-44 rounded-2xl overflow-hidden bg-slate-100">
              <img src={selectedResource.image} alt={selectedResource.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg"><strong>Supplies Available:</strong> {selectedResource.items}</div>
              <div className="p-2 bg-slate-50 rounded-lg"><strong>Operating Window:</strong> {selectedResource.timings}</div>
              <div className="p-2 bg-slate-50 rounded-lg"><strong>Dispatching Agency:</strong> {selectedResource.provider}</div>
              <div className="p-2 bg-slate-50 rounded-lg"><strong>Proximity:</strong> {selectedResource.distance} from center</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedResource.lat},${selectedResource.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#1268E8] text-white text-xs font-bold hover:bg-blue-700"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Request Specific Supplies Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#172B4D]">Request Essential Relief Supplies</h3>
                <p className="text-xs text-slate-500">Government relief dispatched by volunteer courier</p>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestSuccessMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-extrabold text-slate-800">{requestSuccessMsg}</h4>
              </div>
            ) : (
              <form onSubmit={handleCreateResourceRequest} className="space-y-4">
                <div>
                  <label htmlFor="supply-item-type" className="block text-xs font-bold text-slate-700 mb-1">
                    Supply Category
                  </label>
                  <select
                    id="supply-item-type"
                    name="supplyItemType"
                    value={requestItemType}
                    onChange={(e) => setRequestItemType(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#1268E8]"
                  >
                    <option value="Food Ration Kit">Food Ration Kit (Dry Rice, Dal, Biscuits)</option>
                    <option value="Water Pouch Crate">Water Pouch Crate (20 Liters)</option>
                    <option value="Medical First Aid & Insulin">Medical First Aid Kit & Insulin</option>
                    <option value="Baby Milk & Infant Supplies">Baby Milk Formula & Diapers</option>
                    <option value="Blankets & Weather Tarps">Blankets & Weather Tarpaulin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="supply-quantity" className="block text-xs font-bold text-slate-700 mb-1">
                    Units / Kits Required
                  </label>
                  <input
                    type="number"
                    id="supply-quantity"
                    name="supplyQuantity"
                    min="1"
                    max="20"
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1268E8]"
                  />
                </div>

                <div>
                  <label htmlFor="supply-delivery-address" className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Address or Landmark
                  </label>
                  <input
                    type="text"
                    id="supply-delivery-address"
                    name="supplyDeliveryAddress"
                    value={requestAddress}
                    onChange={(e) => setRequestAddress(e.target.value)}
                    placeholder="Enter house / shelter / GPS address"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1268E8]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1268E8] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Confirm Requisition
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
