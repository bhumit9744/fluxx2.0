import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { useEnvironmentStore } from '../../../stores/environmentStore';

export const ReportsControls: React.FC = () => {
  const {
    reportsSearchQuery,
    setReportsSearchQuery,
    reportsCategoryFilter,
    setReportsCategoryFilter,
    reportsSortBy,
    setReportsSortBy,
    fetchReports,
    setActiveSection
  } = useEnvironmentStore();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'All', label: 'All Reports' },
    { id: 'survey', label: 'Surveys' },
    { id: 'analysis', label: 'Environmental Analysis' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'incident', label: 'Incident Reports' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'highest_risk', label: 'Highest Risk' },
    { id: 'lowest_risk', label: 'Lowest Risk' }
  ];

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReportsSearchQuery(e.target.value);
    // debounced search trigger
    setTimeout(() => {
      fetchReports();
    }, 250);
  };

  const handleCategorySelect = (id: string) => {
    setReportsCategoryFilter(id);
    setIsCategoryOpen(false);
    setTimeout(() => {
      fetchReports();
    }, 50);
  };

  const handleSortSelect = (id: string) => {
    setReportsSortBy(id);
    setIsSortOpen(false);
    setTimeout(() => {
      fetchReports();
    }, 50);
  };

  const currentCategoryLabel = categories.find((c) => c.id === reportsCategoryFilter)?.label || 'All Reports';
  const currentSortLabel = sortOptions.find((s) => s.id === reportsSortBy)?.label || 'Newest First';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#F3E6D7] shadow-xs select-none">
      
      {/* Left: Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={reportsSearchQuery}
          onChange={handleSearchChange}
          placeholder="Search by report name, location, date, or ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F2]/70 border border-[#F3E6D7] text-[13px] font-medium text-[#2B211C] placeholder-[#8C827A]/70 focus:outline-none focus:border-[#F47A24] focus:bg-white transition-all"
        />
      </div>

      {/* Right Controls: Filters & New Report Button */}
      <div className="flex items-center flex-wrap gap-2.5">
        
        {/* Category Filter Dropdown */}
        <div className="relative" ref={categoryRef}>
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#F3E6D7] hover:border-[#F47A24]/50 text-xs font-bold text-[#2B211C] shadow-2xs transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#8C827A]" />
            <span>{currentCategoryLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8C827A] transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#F3E6D7] shadow-[0_12px_32px_rgba(70,40,20,0.12)] py-1.5 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-extrabold text-[#8C827A] uppercase tracking-wider border-b border-[#FAF3EA]">
                Filter Category
              </div>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategorySelect(c.id)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    reportsCategoryFilter === c.id 
                      ? 'bg-[#FFF0E5] text-[#F47A24] font-bold' 
                      : 'text-[#2B211C] hover:bg-[#FAF3EA]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#F3E6D7] hover:border-[#F47A24]/50 text-xs font-bold text-[#2B211C] shadow-2xs transition-all cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C827A]" />
            <span>{currentSortLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8C827A] transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-white/98 backdrop-blur-2xl border border-[#F3E6D7] shadow-[0_12px_32px_rgba(70,40,20,0.12)] py-1.5 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-extrabold text-[#8C827A] uppercase tracking-wider border-b border-[#FAF3EA]">
                Sort By
              </div>
              {sortOptions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSortSelect(s.id)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    reportsSortBy === s.id 
                      ? 'bg-[#FFF0E5] text-[#F47A24] font-bold' 
                      : 'text-[#2B211C] hover:bg-[#FAF3EA]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* + Generate New Report Action Button */}
        <button
          onClick={() => setActiveSection('environment')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#F47A24] hover:bg-[#E06815] text-white text-xs font-extrabold shadow-[0_4px_16px_rgba(244,122,36,0.28)] hover:shadow-[0_6px_20px_rgba(244,122,36,0.36)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>

      </div>

    </div>
  );
};
