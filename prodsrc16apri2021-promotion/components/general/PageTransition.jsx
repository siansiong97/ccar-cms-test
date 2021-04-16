import React from "react";
import styled from "styled-components";
import { useTransition, animated } from "react-spring";
import { useRouter } from "../../hooks/useRouter";



export const PageTransition = ({ children, ...props }) => {
  const router = useRouter();
  const transitions = useTransition(router, router => router.pathname, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0
    }
  });

  return (
    <>
      {transitions.map(({ item, props: style, key }) => {
        return (
          <Page key={key} style={style}>
            {children}
          </Page>
        );
      })}
    </>
  );
};

const Page = styled(animated.main)`
  min-height: 100%;
`;
