export enum TRAFFIC_LIGHT {
  darkgreen = 'darkgreen',
  lightgreen = 'lightgreen',
  yellow = 'yellow',
  orange = 'orange',
  red = 'red',
  white = 'white'
};

export enum CONNECTION {
  perfect = TRAFFIC_LIGHT.darkgreen,
  isolated = TRAFFIC_LIGHT.yellow,
  disconnected = TRAFFIC_LIGHT.red,
  offlineMode = TRAFFIC_LIGHT.white,
}

export enum SECURITY_INDICATOR {
  advanced = TRAFFIC_LIGHT.darkgreen,
  good = TRAFFIC_LIGHT.lightgreen,
  dubious = TRAFFIC_LIGHT.orange,
  insufficient = TRAFFIC_LIGHT.red
}
