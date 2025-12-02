import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export interface AIAnalysisResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  intent: string;
  suggestedResponse: string;
  keyTopics: string[];
}