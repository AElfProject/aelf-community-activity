import React from 'react';

import './index.less';

const classPreix = 'tutorial-list';

function TutorialList({ list }) {
  return (
    <div className={classPreix}>
      {
        list.map(item => (
          <span className={`${classPreix}-item`} key={item.link}>
            <a
              href={item.link}
              target="_blank"
            >
              {item.name}
            </a>
          </span>
        ))
      }
    </div>
  )
}

export default TutorialList;
