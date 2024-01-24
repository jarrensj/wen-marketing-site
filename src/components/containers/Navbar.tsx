import {
  AppBar,
  Button,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  BIRDEYE_LINK,
  BUY_LINK_ENABLED,
  BUY_WEN_LINK,
  CLAIM_AIRDROP_EXPIRED,
  CLAIM_AIRDROP_LINK,
  CLAIM_AIRDROP_STARTED,
  LOGO_TEXT,
  WEN_TWITTER_LINK,
} from "../../constants";
import { BirdEyeIcon, Column, Row, TwitterIcon } from "../common";
import { NAV_BREAKPOINT, NAV_HEIGHT_PX } from "../../constants/app";
import { ReactNode, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useHomeScrollContext } from "../../contexts";
import { FONT_SIZES } from "../theme";
import { useOutsideAlerter } from "../../util";

function useOptions(): {
  text: string;
  primary?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  hide?: boolean;
}[] {
  const { scrollTo } = useHomeScrollContext();

  return [
    {
      text: "x.com",
      icon: <TwitterIcon />,
      onClick: () => window.open(WEN_TWITTER_LINK),
    },
    {
      text: "Birdeye",
      icon: <BirdEyeIcon />,
      onClick: () => window.open(BIRDEYE_LINK),
    },

    {
      text: "About",
      onClick: scrollTo.about,
    },
    {
      text: "Tokenomics",
      onClick: scrollTo.tokenomics,
    },
    {
      text: "Foundation",
      onClick: scrollTo.foundation,
    },

    {
      text: "Claim Airdrop",
      primary: true,
      onClick: () => window.open(CLAIM_AIRDROP_LINK),
      hide: CLAIM_AIRDROP_EXPIRED || !CLAIM_AIRDROP_STARTED,
    },
    {
      text: "Trade Wen",
      primary: true,
      onClick: () => window.open(BUY_WEN_LINK),
      hide: !CLAIM_AIRDROP_EXPIRED || !BUY_LINK_ENABLED,
    },
  ].filter((o) => !o.hide);
}

export default function Navbar() {
  return (
    <AppBar
      elevation={0}
      sx={{
        p: 2,
        background: ({ palette }) => palette.background.default,
      }}
      position="fixed"
    >
      <Mobile />
      <Desktop />
    </AppBar>
  );
}

function Desktop() {
  const options = useOptions();
  return (
    <Row sx={{ [NAV_BREAKPOINT.below]: { display: "none" } }} spaceBetween>
      <Logo />
      <Row spacing={1}>
        {options.map((o, i) => {
          if (o.icon) {
            return (
              <Tooltip key={i} title={o.text}>
                <IconButton sx={{ minWidth: 0, gap: 1 }} onClick={o.onClick}>
                  {o.icon}
                </IconButton>
              </Tooltip>
            );
          }
          return (
            <Button
              sx={{ minWidth: 0, gap: 1 }}
              onClick={o.onClick}
              variant={o.primary ? "contained" : "text"}
            >
              {o.text}
            </Button>
          );
        })}
      </Row>
    </Row>
  );
}

function Mobile() {
  const [open, setOpen] = useState(false);
  const options = useOptions();
  const close = () => setOpen(false);

  const ref = useOutsideAlerter(close);

  return (
    <Stack
      ref={ref}
      sx={{ position: "relative", [NAV_BREAKPOINT.above]: { display: "none" } }}
    >
      <Row spaceBetween>
        <Logo />
        <IconButton
          sx={{ svg: { fontSize: FONT_SIZES.h2 }, p: 1 }}
          color="primary"
          onClick={() => setOpen((prev) => !prev)}
        >
          <MenuIcon />
        </IconButton>
      </Row>

      <Collapse
        onClick={close}
        sx={{
          width: "100%",
          top: NAV_HEIGHT_PX,
          left: 0,
          right: 0,
          background: ({ palette }) => palette.divider,
          position: "fixed",
        }}
        in={open}
      >
        <Column sx={{ p: 2 }} spacing={1}>
          {options.map((o, i) => (
            <Button
              sx={{ gap: 1 }}
              onClick={o.onClick}
              key={i}
              variant={o.primary ? "contained" : "text"}
            >
              {o.text}
            </Button>
          ))}
        </Column>
      </Collapse>
    </Stack>
  );
}

const Logo = () => (
  <img alt="Wen Logo" src={LOGO_TEXT} width="70px" height="30px" />
);
