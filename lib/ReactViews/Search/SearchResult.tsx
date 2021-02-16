import React from "react";
import styled, { useTheme } from "styled-components";
import { Li } from "../../Styled/List";
import Icon, { StyledIcon } from "../Icon";
import highlightKeyword from "../ReactViewHelpers/highlightKeyword";

const Box = require("../../Styled/Box").default;
const BoxSpan = require("../../Styled/Box").BoxSpan;
const TextSpan = require("../../Styled/Text").TextSpan;
const RawButton = require("../../Styled/Button").RawButton;
const Spacing = require("../../Styled/Spacing").default;
const SpacingSpan = require("../../Styled/Spacing").SpacingSpan;
const Hr = require("../../Styled/Hr").default;

// Not sure how to generalise this or if it should be kept in stlyed/Button.jsx

// Initially had this as border bottom on the button, but need a HR given it's not a full width border
// // ${p => !p.isLastResult && `border-bottom: 1px solid ${p.theme.greyLighter};`}
const RawButtonAndHighlight = styled(RawButton)`
  ${p => `
  &:hover, &:focus {
    background-color: ${p.theme.greyLighter};
    ${StyledIcon} {
      fill-opacity: 1;
    }
  }`}
`;

interface SearchResultProps {
  name: string;
  clickAction(): void;
  isLastResult: boolean;
  locationSearchText: string;
  icon: string;
}

const SearchResult: React.FC<SearchResultProps> = (
  props: SearchResultProps
) => {
  const theme = useTheme();
  const highlightedResultName = highlightKeyword(
    props.name,
    props.locationSearchText
  );
  const isLightTheme = true;
  const isDarkTheme = false;
  return (
    <Li>
      <Box fullWidth column>
        <RawButtonAndHighlight
          type="button"
          onClick={props.clickAction}
          fullWidth
        >
          {/* {!isLastResult && ( */}
          <BoxSpan>
            <SpacingSpan right={2} />
            <Hr size={1} fullWidth borderBottomColor={theme.greyLighter} />
            <SpacingSpan right={2} />
          </BoxSpan>
          {/* )} */}
          <TextSpan
            breakWord
            large
            // (You need light text on a dark theme, and vice versa)
            textLight={isDarkTheme}
            textDark={isLightTheme}
          >
            <BoxSpan
              paddedRatio={2}
              paddedVertically={3}
              centered
              justifySpaceBetween
            >
              {props.icon && (
                <StyledIcon
                  // (You need light text on a dark theme, and vice versa)
                  fillColor={isLightTheme ? theme.textDarker : false}
                  light={isDarkTheme}
                  styledWidth={"16px"}
                  // @ts-ignore
                  glyph={Icon.GLYPHS[props.icon]}
                />
              )}
              <Spacing right={2} />
              <BoxSpan fullWidth>
                <TextSpan noFontSize textAlignLeft>
                  {highlightedResultName}
                </TextSpan>
              </BoxSpan>
              <StyledIcon
                // (You need light text on a dark theme, and vice versa)
                fillColor={isLightTheme ? theme.textDarker : false}
                light={isDarkTheme}
                styledWidth={"14px"}
                css={"fill-opacity:0;"}
                glyph={Icon.GLYPHS.right2}
              />
            </BoxSpan>
          </TextSpan>
        </RawButtonAndHighlight>
      </Box>
    </Li>
  );
};

export default SearchResult;
