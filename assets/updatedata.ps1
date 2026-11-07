
[CmdletBinding()]
param (
  [string]$PageName,
  [string]$Author,	[string]$Editor,	[string]$Created,	[string]$Modified
)
process {
  $newPage = Get-PnPPage $PageName
  $itemsId = $newPage.PageId
  Set-PnPListItem -List "SitePages" -Identity $itemsId -Values @{"Author" = $Author;  "Editor"=$Editor; "Created" = $Created; "Modified" = $Modified } -UpdateType Update
}
end {

  Write-Host "Done! :)" -ForegroundColor Green
}
