export type Phase = 'preparation' | 'production' | 'inspection' | 'archiving';

export interface Project {
  id: string;
  name: string;
  bidNumber: string;
  status: 'ongoing' | 'completed' | 'pending';
  currentPhase: Phase;
  deadline: string;
}

export interface TaskAlert {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  time: string;
  color: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  section?: string;
}
