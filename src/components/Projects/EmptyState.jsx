import React from 'react';
import { FolderOpen } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({ activeFilter, onReset }) {
  return (
    /* role="status" + aria-live="polite" ensures screen readers
       announce the empty state when filter changes */
    <div
      className={styles.wrap}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.card}>

        {/* Animated icon with breathing glow ring */}
        <div className={styles.iconWrap} aria-hidden="true">
          <FolderOpen className={styles.icon} />
        </div>

        {/* Headline */}
        <h3 className={styles.headline}>No Projects Yet</h3>

        {/* Contextual message — shows which filter triggered the state */}
        <p className={styles.message}>
          {activeFilter ? (
            <>
              No projects tagged{' '}
              <span className={styles.filterTag}>{activeFilter}</span>
              {' '}yet. Projects in this category will appear here as I continue
              building and shipping new products.
            </>
          ) : (
            'Projects will appear here as they are added.'
          )}
        </p>

        {/* Recovery CTA — resets the filter */}
        {onReset && (
          <button
            className={styles.cta}
            onClick={onReset}
            aria-label="Show all projects"
          >
            ← Show all projects
          </button>
        )}

      </div>
    </div>
  );
}
