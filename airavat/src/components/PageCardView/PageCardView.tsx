import * as React from 'react';
import PageCard from '../PageCards/PageCard';
import { useHandbookStyles } from '../../common/Styles';
import { IPageCardViewProps } from '../../common/Interfaces';

const PageCardView: React.FC<IPageCardViewProps> = (props) => {
  const classes = useHandbookStyles();
  return (
    <div className={classes.pageCardMain}>
      {props.pages.map((item) => {
        const page = item.page;
        return page && item.parentId === props.parentId
          ? <PageCard key={page.id} page={page} strings={props.strings} />
          : null;
      })}
    </div>
  );
};

export default PageCardView;
