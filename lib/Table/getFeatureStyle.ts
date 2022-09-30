import Color from "terriajs-cesium/Source/Core/Color";
import { getMakiIcon, isMakiIcon } from "../Map/Icons/Maki/MakiIcons";
import TableStyle from "./TableStyle";
import { isConstantStyleMap } from "./TableStyleMap";

export function getFeatureStyle(style: TableStyle, rowId: number) {
  const color =
    style.colorMap.mapValueToColor(style.colorColumn?.valuesForType[rowId]) ??
    null;

  const pointSize =
    style.pointSizeColumn !== undefined
      ? style.pointSizeMap.mapValueToPointSize(
          style.pointSizeColumn.valueFunctionForType(rowId)
        )
      : undefined;

  const pointStyle = isConstantStyleMap(style.pointStyleMap.styleMap)
    ? style.pointStyleMap.styleMap.style
    : style.pointStyleMap.styleMap.mapValueToStyle(rowId);

  const outlineStyle = isConstantStyleMap(style.outlineStyleMap.styleMap)
    ? style.outlineStyleMap.styleMap.style
    : style.outlineStyleMap.styleMap.mapValueToStyle(rowId);

  const outlineColor = Color.fromCssColorString(
    outlineStyle.color ?? style.tableModel.terria.baseMapContrastColor
  );

  const trailStyle = isConstantStyleMap(style.pointTrailStyleMap.styleMap)
    ? style.pointTrailStyleMap.styleMap.style
    : style.pointTrailStyleMap.styleMap.mapValueToStyle(rowId);

  const labelStyle = isConstantStyleMap(style.labelStyleMap.styleMap)
    ? style.labelStyleMap.styleMap.style
    : style.labelStyleMap.styleMap.mapValueToStyle(rowId);

  const makiIcon = getMakiIcon(
    pointStyle.marker ?? "circle",
    color.toCssColorString(),
    outlineStyle.width ?? 1,
    outlineColor.toCssColorString(),
    pointSize ?? pointStyle.height ?? 24,
    pointSize ?? pointStyle.width ?? 24
  );

  return {
    color,
    labelStyle,
    pointSize,
    pointStyle,
    outlineStyle,
    trailStyle,
    outlineColor,
    makiIcon,
    isMakiIcon: isMakiIcon(pointStyle.marker)
  };
}
