import React from "react";
import { navigate } from "@reach/router";
import { withStyles } from "@arwes/arwes";
import { withSounds } from "@arwes/sounds";
import AnimateContext from "../helpers/animateContext";

const isExtern = /^https?:\/\//;

export const Navigator = withStyles(() => {})(
  withSounds()(({ theme, sounds, children, ...etc }) => {
    const linkTrigger = (href, target, hide, reveal) => {
      sounds.click && sounds.click.play();

      const { pathname, search } = window.location;
      if (pathname + search === href) {
        return;
      }

      if (!target) {
        hide();
      }

      setTimeout(() => {
        if (target) {
          window.open(href);
        } else if (isExtern.test(href)) {
          window.location.href = href;
        } else {
          navigate(href).then(reveal);
        }
      }, theme.animTime);
    };
    return (
      <AnimateContext.Consumer>
        {({ hide, reveal }) =>
          children((href, target) => linkTrigger(href, target, hide, reveal))
        }
      </AnimateContext.Consumer>
    );
  })
);

const Link = props => {
  const { to, href, target, children, ...etc } = props;
  const path = to || href;

  return (
    <Navigator>
      {navigate => (
        <a
          {...etc}
          href={path}
          target={target}
          onClick={e => {
            e.preventDefault();
            navigate(path, target);
          }}
        >
          {children}
        </a>
      )}
    </Navigator>
  );
};

export default withStyles(() => {})(withSounds()(Link));
