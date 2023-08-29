{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [ 
    nodejs_latest
    nodePackages_latest.pnpm
  ];
  shellHook = ''
    pnpm i
    pnpm build --filter=./packages/*

    cd apps/cra
    pnpm dev
  '';
}
