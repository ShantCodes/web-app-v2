import { useEffect } from 'react';
import { ExpandableText } from 'src/components/atoms/expandable-text';
import { COUNTRIES_DICT } from 'src/constants/COUNTRIES';
import { socialCausesToCategory } from 'src/core/adaptors';
import { toRelativeTime } from 'src/core/relative-time';
import { printWhen } from 'src/core/utils';
import { getJobStructuresData } from 'src/pages/job-detail/job-details.jobStructuredData';

import css from './job-list.module.scss';
import { getCategories } from './job-list.services';
import { JobListProps } from './job-list.types';
import { Avatar } from '../../atoms/avatar/avatar';
import { Card } from '../../atoms/card/card';
import { Categories } from '../../atoms/categories/categories';
import { CategoriesClickable } from '../../atoms/categories-clickable/categories-clickable';

export const JobList = (props: JobListProps): JSX.Element => {
  const { data, showMorePage, onMorePageClick, ...rest } = props;

  function getCountryName(shortname?: keyof typeof COUNTRIES_DICT | undefined) {
    if (shortname && COUNTRIES_DICT[shortname]) {
      return COUNTRIES_DICT[shortname];
    } else {
      return shortname;
    }
  }

  const location = (job: JobListProps['data'][0]) =>
    `${job.city || job.identity_meta.city}, ${getCountryName(
      (job.country || job.identity_meta.country) as keyof typeof COUNTRIES_DICT | undefined,
    )}`;

  const seeMoreJSX = (
    <div className={css.seeMore} onClick={() => onMorePageClick()}>
      See more
    </div>
  );
  return (
    <div style={rest} className={css.container}>
      {data.map((job) => {
        return (
          <Card key={job.id} cursor="pointer" onClick={() => props.onClick(job.id)}>
            <div className={css.header}>
              <Avatar
                customStyle={css.avatar}
                type="organizations"
                img={job.identity_meta ? job.identity_meta.image : ''}
              />
              <div className={css.orgNameAndLocation}>
                <div>{job.identity_meta?.name}</div>
                <div className={css.orgLocation}>{location(job)}</div>
              </div>
            </div>
            <div className={css.body}>
              <div className={css.jobTitle}>{job.title}</div>
              <Categories marginBottom="1rem" list={getCategories(job)} />
              <div className={css.description}>
                <ExpandableText text={job.description} isMarkdown />
              </div>
              <CategoriesClickable marginBottom="1rem" list={socialCausesToCategory(job.causes_tags)} />
            </div>
            <div className={css.footer}>{toRelativeTime(job.updated_at)}</div>
          </Card>
        );
      })}

      {printWhen(seeMoreJSX, showMorePage)}
    </div>
  );
};
