import { useGuideStore } from '@/src/game/store';
import React, { useLayoutEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom'; // Import Portal

export const Guide = () => {
  const { isGuide, currentStep, steps, nextStep, toggleGuide } = useGuideStore();
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dialogSize, setDialogSize] = useState({ width: 288, height: 0 }); // w-72 = 288px

  const stepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useLayoutEffect(() => {
    if (!isGuide) return;

    const updatePosition = () => {
      const element = document.getElementById(stepData.targetId);
      const dialog = dialogRef.current;
      
      if (element && dialog) {
        const rect = element.getBoundingClientRect();
        const dRect = dialog.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const minGap = 25;
        
        setDialogSize({
          width: dRect.width,
          height: dRect.height,
        });

        // Calculate available space in all directions
        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;
        
        const dialogHeight = dRect.height;
        const dialogWidth = dRect.width;
        
        // Determine best placement
        let decidedPlacement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
        
        // First, try vertical placement
        if (spaceBelow >= dialogHeight + minGap) {
          decidedPlacement = 'bottom';
        } else if (spaceAbove >= dialogHeight + minGap) {
          decidedPlacement = 'top';
        } else {
          // Not enough vertical space, try horizontal placement
          if (spaceRight >= dialogWidth + minGap) {
            decidedPlacement = 'right';
          } else if (spaceLeft >= dialogWidth + minGap) {
            decidedPlacement = 'left';
          } else {
            // Fallback to best vertical option even if constrained
            decidedPlacement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
          }
        }
        
        setPlacement(decidedPlacement);

        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    const timeout = setTimeout(updatePosition, 30);

    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timeout);
    };
  }, [isGuide, currentStep, stepData.targetId]);

  if (!isGuide) return null;

  // Calculate position based on placement direction
  let dialogTop = coords.top;
  let dialogLeft = coords.left;

  if (placement === 'bottom') {
    dialogTop = coords.top + coords.height + 25;
    dialogLeft = Math.max(20, Math.min(window.innerWidth - 320, coords.left + (coords.width / 2) - 144));
  } else if (placement === 'top') {
    dialogTop = coords.top - dialogSize.height - 25;
    dialogLeft = Math.max(20, Math.min(window.innerWidth - 320, coords.left + (coords.width / 2) - 144));
  } else if (placement === 'right') {
    dialogTop = coords.top + (coords.height / 2) - (dialogSize.height / 2);
    dialogLeft = coords.left + coords.width + 25;
  } else if (placement === 'left') {
    dialogTop = coords.top + (coords.height / 2) - (dialogSize.height / 2);
    dialogLeft = coords.left - dialogSize.width - 25;
  }

  // Clamp top position to viewport
  dialogTop = Math.max(10, Math.min(window.innerHeight - 60, dialogTop));

  // WE WRAP EVERYTHING IN A PORTAL
  return createPortal(
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {/* 1. THE SPOTLIGHT */}
      <div 
        className="absolute rounded-lg transition-all duration-300 ease-in-out shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] border-2 border-cyan-400"
        style={{
          top: coords.top - 4,
          left: coords.left - 4,
          width: coords.width + 8,
          height: coords.height + 8,
        }}
      />

      {/* 2. THE DIALOGUE BOX */}
      <div 
        ref={dialogRef}
        className="absolute pointer-events-auto w-72 p-5 bg-slate-900 border-2 border-cyan-500 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all duration-300"
        style={{
          top: dialogTop,
          left: dialogLeft,
        }}
      >
        <p className="text-white text-xs mb-5 leading-relaxed font-medium font-[code]">
          {stepData.text}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-white text-xs font-semibold">
            {currentStep + 1}/{steps.length}
          </span>
          <button 
            onClick={() => isLastStep ? toggleGuide(null) : nextStep()}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-lg uppercase tracking-tighter transition-all active:scale-95 whitespace-nowrap font-[code]"
          >
            {isLastStep ? "Finish" : "Next Step"}
          </button> 
        </div>

        {/* SMART ARROW */}
        <div 
          className={`absolute w-4 h-4 bg-slate-900 border-cyan-500 rotate-45
            ${placement === 'bottom' 
              ? 'left-1/2 -translate-x-1/2 -top-2 border-t-2 border-l-2' 
              : placement === 'top'
              ? 'left-1/2 -translate-x-1/2 -bottom-2 border-b-2 border-r-2'
              : placement === 'right'
              ? 'top-1/2 -translate-y-1/2 -left-2 border-b-2 border-l-2'
              : 'top-1/2 -translate-y-1/2 -right-2 border-t-2 border-r-2'
            }`} 
        />
      </div>
    </div>,
    document.body // This renders it outside the 'game' div entirely
  );
};