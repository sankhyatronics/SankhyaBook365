[CmdletBinding()]
param (
  [string]$Title,
  [string]$PageName, 
  [string]$TopicHeader,
  [string]$Author,		
  [string]$ImageUrl
)

begin {}
process {
  Write-Host "Deleting if exist ...";
  Remove-PnPPage $PageName -Force;

  Write-Host "Adding new page..."
  $newPage = Add-PnPPage -Name $PageName -LayoutType Article -Title $Title -HeaderLayoutType FullWidthImage;

  # Set the header, topic, image, and person
  Write-Host "Setting the header, topic, image, and person...";
    
  $newPage.PageHeader.ImageServerRelativeUrl = $ImageUrl;
  $newPage.PageHeader.TopicHeader = $TopicHeader;
  # $newPage.PageHeader.show = $true
  $newPage.PageHeader.ShowTopicHeader = $true

  $newPage.PageHeader.Authors = "[{`"email`":`"$($Author)`"}]";
  $newPage.PageHeader.AuthorByLine = "[`"$($Author)`"]";
  
  # Save the page
  $newPage.Save();

  # Refresh variable
  $newPage = Get-PnPPage $PageName;
  $newPage | Set-PnPPage -ThumbnailUrl $ImageUrl;

  # Create a two-column left section
  Write-Host "Row 1 - Setting the section and web parts";
  $newPage | Add-PnPPageSection -SectionTemplate TwoColumnLeft -Order 1;

  # Column 1 - Text Web Part
  $newPage | Add-PnPPageTextPart -Order 1 -Column 1 -Section 1 `
    -Text @"
                        <h2>Welcome to the Page</h2>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. </p>
                        <p><em>Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.​​​​​​​</em></p>
"@;

  Write-Host "Publishing Page ...";
  $newPage | Set-PnPPage -Publish -PromoteAs None;
}
end {
  Write-Host "Done! :)" -ForegroundColor Green;
}