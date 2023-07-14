import { CopyVolumeMode } from '@fishprovider/utils/dist/constants/account';
import type {
  CopySettings, ProtectSettings, Settings, TradeSettings,
} from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

import ParentLinks from '~components/account/ParentLinks';
import { CopyVolumeModeText } from '~constants/account';
import Badge from '~ui/core/Badge';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Tooltip from '~ui/core/Tooltip';

interface CopyChipsProps {
  parentId: string;
  copySettings: CopySettings;
  copyVolumeRatio?: number;
}

function CopyChips({
  parentId,
  copySettings,
  copyVolumeRatio,
}: CopyChipsProps) {
  const {
    enableCopy,
    enableCopyOrderClose,
    enableCopyOrderSLTP,
    enabledEquitySL,
    equitySLRatio,

    copyVolumeMode = CopyVolumeMode.auto,
    copyVolumeRatioFixed,
    copyVolumeLotFixed,
    copyVolumeRatioAuto,
    copyVolumeLotMin,
    copyVolumeLotMax,
  } = copySettings;

  return (
    <Group spacing="sm">
      {enableCopy && (
        <>
          <ParentLinks parentIds={[parentId]} />
          {enableCopyOrderClose && (
            <Tooltip label="Auto close copying positions based on parent's position closing">
              <Badge color="orange">
                CP-Close
              </Badge>
            </Tooltip>
          )}
          {enableCopyOrderSLTP && (
            <Tooltip label="Auto set StopLoss and TakeProfit for copying positions based on parent's SLTP">
              <Badge color="orange">
                CP-SLTP
              </Badge>
            </Tooltip>
          )}
          {enabledEquitySL && (
            <Tooltip label="Auto stop copy parents when Equity/Balance down to this percentage">
              <Badge color="orange">
                {`CP-ESL ${equitySLRatio}%`}
              </Badge>
            </Tooltip>
          )}
          {copyVolumeMode === CopyVolumeMode.auto && copyVolumeRatio && (
            <Tooltip label={CopyVolumeModeText[CopyVolumeMode.auto]?.description as string}>
              <Badge color="orange">
                {`CP-Ratio ${copyVolumeRatio}`}
              </Badge>
            </Tooltip>
          )}
          {copyVolumeMode === CopyVolumeMode.fixedRatio && (
            <Tooltip label={CopyVolumeModeText[CopyVolumeMode.fixedRatio]?.description as string}>
              <Badge color="orange">
                {`CP-Ratio ${copyVolumeRatioFixed}`}
              </Badge>
            </Tooltip>
          )}
          {copyVolumeMode === CopyVolumeMode.fixedLot && (
            <Tooltip label={CopyVolumeModeText[CopyVolumeMode.fixedLot]?.description as string}>
              <Badge color="orange">
                {`CP-Lot ${copyVolumeLotFixed}`}
              </Badge>
            </Tooltip>
          )}
          {copyVolumeMode === CopyVolumeMode.autoWithRatio && copyVolumeRatio && (
            <Tooltip
              label={CopyVolumeModeText[CopyVolumeMode.autoWithRatio]?.description as string}
            >
              <Badge color="orange">
                {`CP-Ratio ${copyVolumeRatioAuto}`}
              </Badge>
            </Tooltip>
          )}
          {[CopyVolumeMode.auto,
            CopyVolumeMode.autoWithRatio,
            CopyVolumeMode.fixedRatio,
          ].includes(copyVolumeMode) && (
            <>
              {copyVolumeLotMin && (
                <Tooltip label="Min Lot to copy">
                  <Badge color="orange">
                    {`CP-Lot-Min ${copyVolumeLotMin}`}
                  </Badge>
                </Tooltip>
              )}
              {copyVolumeLotMax && (
                <Tooltip label="Max Lot to copy">
                  <Badge color="orange">
                    {`CP-Lot-Max ${copyVolumeLotMax}`}
                  </Badge>
                </Tooltip>
              )}
            </>
          )}
        </>
      )}
    </Group>
  );
}

interface Props {
  tradeSettings?: TradeSettings,
  protectSettings?: ProtectSettings,
  settings?: Settings,
}

function BotChips({
  tradeSettings = {},
  protectSettings = {},
  settings = {},
}: Props) {
  const {
    enabledCloseProfit,
    takeProfit,
    stopLoss,

    enabledCloseEquity,
    targetEquity,
    stopEquity,

    enabledCloseTime,
    closeTime,
    closeTimeIfProfit,
  } = tradeSettings;

  const {
    enabledEquityLock,
    equityLock,
    equityLockHours,
  } = protectSettings;

  const {
    enableCopyParent,
    parents,
    copyVolumeRatio,
  } = settings;

  const parentsArr = _.sortBy(_.entries(parents), (item) => item[0]);

  return (
    <Group spacing="sm">
      {enabledCloseProfit && (
        <Tooltip
          label={`Auto close all positions on profit ${takeProfit} or loss ${stopLoss}`}
        >
          <Badge>{`ACP ${takeProfit}/${stopLoss}`}</Badge>
        </Tooltip>
      )}
      {enabledCloseEquity && (
        <Tooltip
          label={`Auto close all positions on equity ${targetEquity} or ${stopEquity}`}
        >
          <Badge>{`ACE ${targetEquity}/${stopEquity}`}</Badge>
        </Tooltip>
      )}
      {enabledCloseTime && (
        <Tooltip
          label={`Auto close all positions at ${moment(closeTime)} ${
            closeTimeIfProfit ? 'if total profits are positive' : ''
          }`}
        >
          <Badge>{`ACT ${moment(closeTime).format('HH:mm')}`}</Badge>
        </Tooltip>
      )}

      {enabledEquityLock && (
        <Tooltip
          label={`Auto close all orders and lock account in ${equityLockHours} hours when Equity reaches ${equityLock}`}
        >
          <Badge>{`EL ${equityLock}`}</Badge>
        </Tooltip>
      )}

      {enableCopyParent && (
        <Stack spacing="xs">
          {`Copying: ${parentsArr.filter((item) => item[1].enableCopy).length}/${parentsArr.length}`}
          {parentsArr.map(([parentId, copySettings]) => (
            <CopyChips
              key={parentId}
              parentId={parentId}
              copySettings={copySettings}
              copyVolumeRatio={copyVolumeRatio}
            />
          ))}
        </Stack>
      )}
    </Group>
  );
}

export default BotChips;
