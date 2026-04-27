import { trigger, transition, style, animate, state } from '@angular/animations';

export const drawerOld = trigger('drawer', [

  state('closed', style({
    maxHeight: '0px',
    opacity: 0,
    transform: 'translateY(-10px)',
    overflow: 'hidden',
    pointerEvents: 'none'
  })),

  state('open', style({
    maxHeight: '1000px', // nok til kurv (kan justeres)
    opacity: 1,
    transform: 'translateY(0px)',
    overflow: 'hidden',
    pointerEvents: 'auto'
  })),

  transition('closed <=> open', [
    animate('350ms cubic-bezier(0.22, 1, 0.36, 1)')
  ])
]);

export const drawer = trigger('drawer', [

  state('closed', style({
    height: '0px',
    opacity: 0,
    overflow: 'hidden',
    transform: 'translateY(-8px)'
  })),

  state('open', style({
    height: '{{height}}',
    opacity: 1,
    overflow: 'hidden',
    transform: 'translateY(0px)'
  }), { params: { height: '0px' } }),

  transition('closed <=> open', [
    animate('320ms cubic-bezier(0.22, 1, 0.36, 1)')
  ])
]);