{
  description = "Flake for dev shell each default system";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in rec {
        packages.cra = import ./apps/cra/shell.nix {inherit pkgs;};  ## TODO  real package
        packages.next = import ./apps/web/shell.nix {inherit pkgs;};  ## TODO  real package
        defaultPackage = packages.next;

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [ 
            nodejs_latest
            nodePackages_latest.pnpm
          ];
        };
      }
    );
}
