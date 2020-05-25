import React from 'react';
import PropTypes from 'prop-types';

const ConfusionToggleButton = ({ confused, toggleConfusion }) => {
  return (
    <div className="wrapper" id="bg">
      <label>
        <input
          type="checkbox"
          id="checker"
          name="check-guy"
          onChange={toggleConfusion}
          checked={!confused}
        />
        <div className="ht-ui-check" htmlFor="check-guy">
          <div className="track">
            <div className="inner" />
          </div>
          <div className="handle">
            <div className="faces">
              <div className="sad">
                <div className="eyes">
                  <div>+</div>
                  <div>+</div>
                </div>
                <div className="mouth">-</div>
              </div>
              <div className="happy">
                <div className="eyes">◠ ◠</div>
                <div className="mouth">
                  <span>◗</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

ConfusionToggleButton.propTypes = {
  confused: PropTypes.bool.isRequired,
  toggleConfusion: PropTypes.func.isRequired
};

export default ConfusionToggleButton;
