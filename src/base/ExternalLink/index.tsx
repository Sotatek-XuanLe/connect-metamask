import React, { FC, HTMLProps, useCallback } from "react";
import ReactGA from "react-ga";
interface ExternalLinkProps
  extends Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref" | "onClick"> {
  href?: any;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
}

const ExternalLink: FC<ExternalLinkProps> = ({
  target = "_blank",
  href,
  children,
  rel = "noopener noreferrer",
  className = "",
  color = "default",
  startIcon = undefined,
  endIcon = undefined,
  ...rest
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === "_blank" || event.ctrlKey || event.metaKey) {
        ReactGA.outboundLink({ label: href }, () => {
          console.debug("Fired outbound link event", href);
        });
      } else {
        event.preventDefault();
        // send a ReactGA event and then trigger a location change
        ReactGA.outboundLink({ label: href }, () => {
          window.location.href = href;
        });
      }
    },
    [href, target]
  );

  return (
    <a
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </a>
  );
};

export default ExternalLink;
