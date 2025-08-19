<?php
require_once __DIR__ . '/../classes/Conf.php';

use Ramsey\Uuid\Uuid;
use Aws\S3\S3Client;

class Document
{

    public function generatePDF()
    {
        $file_name = Uuid::uuid4()->toString() . '.pdf';
        $emailTemplate = $this->generateEmailTemplate(
            'Customer Name',
            'Report Title',
            'https://example.com/logo.png',
            '#3498db',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam felis orci, rutrum et fringilla et, aliquet eu lacus. Vivamus in gravida leo. Suspendisse porta aliquam lorem, at iaculis ipsum fermentum nec. Quisque sagittis tempor elit egestas fermentum. Donec a justo tempus, fermentum nulla eget, porta metus. Nam in hendrerit enim. Donec rhoncus turpis id mi elementum commodo. In viverra quam gravida maximus gravida. In hac habitasse platea dictumst. Nulla suscipit molestie ipsum in dictum.

Sed cursus consectetur purus, in hendrerit enim congue id. Donec tempor gravida lacus sit amet fringilla. Pellentesque lobortis cursus ipsum, ut convallis sem imperdiet vitae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris in sapien vitae diam varius ultricies. Praesent quam justo, facilisis tempus lacinia a, viverra in est. Maecenas ac nisi id ipsum cursus aliquam ac a neque. Proin dictum maximus felis, quis accumsan turpis sagittis quis. Nam eget diam quis lectus gravida suscipit. Suspendisse ligula ligula, finibus at risus ut, ullamcorper aliquet metus.

In id interdum risus. Proin leo elit, pharetra ac rhoncus at, dictum sit amet lorem. Etiam sodales ultrices felis a euismod. Quisque molestie diam at erat scelerisque, id ornare neque condimentum. Mauris pulvinar est pretium egestas posuere. Vivamus eu dolor eget elit finibus elementum. Praesent mollis eros at metus condimentum ornare.

Praesent condimentum metus a feugiat placerat. Praesent iaculis lectus enim, nec consequat nisl tristique in. Praesent eu metus finibus, gravida diam quis, porttitor ante. Fusce nec pretium arcu. Phasellus auctor mauris risus, et volutpat lacus auctor et. Aliquam eu leo nec erat sollicitudin fermentum ac eu nunc. Curabitur eu elementum arcu. Nunc pulvinar nunc sed metus placerat, id porta sem auctor. Vestibulum a sodales dolor, a ornare erat. Aliquam consequat, dui a porttitor scelerisque, augue enim aliquet arcu, eget vulputate dolor sem ut elit. Donec hendrerit interdum purus a volutpat. Aenean pellentesque, mi quis aliquet volutpat, urna mauris vestibulum elit, ac molestie dolor lorem ut erat. Proin vitae vehicula arcu, et posuere ante. Nulla lacus erat, iaculis non nulla vel, ultrices elementum orci.

Nullam ipsum massa, efficitur dapibus lobortis non, rhoncus sed lorem. In tristique ante est, ut porttitor nisl molestie sed. Aliquam accumsan, nibh at aliquet pretium, nulla quam scelerisque arcu, sed blandit tellus urna sit amet nisi. Nunc scelerisque nisl eget viverra mattis. Donec consectetur sem ac dolor semper, sed facilisis dolor condimentum. Mauris mattis feugiat mi eget fringilla. Pellentesque sit amet rutrum nibh. Mauris scelerisque odio vel vehicula pulvinar. Etiam placerat arcu nec ultricies faucibus. Quisque molestie ac turpis eget rutrum. Quisque lacinia condimentum mauris in consectetur. Mauris ut accumsan massa. Nam ultricies hendrerit turpis, sit amet auctor orci maximus sit amet. Suspendisse volutpat purus at pharetra auctor.

Nam dui eros, pretium et pulvinar posuere, aliquet in ligula. Aliquam maximus sit amet magna vulputate vulputate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt nulla augue. Proin dignissim quam nec molestie laoreet. Pellentesque vel interdum odio. Praesent erat lorem, consectetur non eros sit amet, vulputate ultricies enim. Duis dapibus tortor dui, at venenatis felis tristique et. Suspendisse urna nibh, maximus vitae aliquam ac, congue vel diam. Phasellus a ex magna. Nam venenatis nisl massa, facilisis cursus ex venenatis id. Morbi vel mi blandit, finibus arcu vel, iaculis urna. In sed dictum velit. Mauris vel turpis aliquam, imperdiet purus sed, posuere dui.

Nunc vitae sapien ante. Nulla eleifend leo id nibh consectetur fermentum. Integer vestibulum quis dolor nec euismod. Morbi augue sapien, condimentum eget vestibulum vel, faucibus ut quam. Praesent fermentum neque at massa laoreet, vel vestibulum quam pellentesque. Suspendisse tempus diam non dui congue, nec mollis quam malesuada. Vivamus et odio est. Vivamus egestas velit eget lectus bibendum consequat. Etiam volutpat aliquam mollis. Vestibulum vitae convallis lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi consectetur fringilla odio, et facilisis nunc blandit nec. Morbi lobortis ipsum non arcu placerat congue. Nulla a leo quis velit tincidunt elementum in sed enim. Sed nulla augue, commodo vitae sagittis vel, lacinia sed elit. Sed eleifend scelerisque diam.

Etiam sagittis erat nec rhoncus suscipit. Pellentesque eu viverra urna. Donec sed massa sed urna lobortis congue. Suspendisse ac odio viverra, vulputate elit vel, scelerisque massa. Suspendisse hendrerit magna tortor, sed laoreet ipsum dictum at. In risus ligula, vestibulum sit amet congue et, elementum vel est. Quisque feugiat dictum lorem sed ornare.

Suspendisse sodales tortor risus. Cras congue et lectus sit amet aliquet. Praesent ultrices lobortis sapien, sed finibus lorem tempor eu. Aliquam erat volutpat. Vestibulum in purus fringilla, ultrices tellus ac, lacinia lacus. Nulla fermentum, est id finibus placerat, nulla diam cursus nisl, ac facilisis odio mauris nec sapien. Nullam pulvinar interdum dolor nec gravida. Fusce tincidunt nisi sed pulvinar scelerisque. Nam id odio ante. Cras nec ex eget velit vulputate porta quis a neque. Vivamus ut erat eget ex finibus mollis. Donec massa odio, tristique in dapibus ac, laoreet quis sem. Quisque dignissim ultricies eros, ut maximus arcu rhoncus ac. Nulla rutrum mi vitae feugiat sodales. Phasellus eget placerat metus.

Donec id facilisis sapien, eget eleifend mauris. Phasellus vitae enim nec libero mollis aliquam eget eu dui. Mauris iaculis lacus eu orci aliquam, eu hendrerit quam convallis. Nullam gravida neque tellus, at pulvinar neque congue ac. Sed posuere sapien erat, ut consequat arcu cursus a. Vivamus luctus erat velit, a vehicula purus facilisis luctus. Integer hendrerit, lacus et volutpat eleifend, diam est volutpat nisl, vitae consequat mi lectus vel est. Vivamus augue turpis, maximus vitae facilisis in, pulvinar in mauris. Donec turpis risus, laoreet sit amet nibh id, maximus lobortis felis. Duis gravida magna ipsum, sit amet volutpat leo viverra id. Praesent dignissim tincidunt enim quis rhoncus. Quisque feugiat dignissim convallis. Pellentesque vel pretium metus. Donec non consectetur libero.

Curabitur placerat hendrerit velit, vel fermentum tellus egestas eu. Integer ac elit at odio lobortis dictum. Phasellus nec justo non nunc vehicula porta. Praesent lacinia quis lorem at iaculis. Donec eget posuere dolor, ac convallis massa. Etiam blandit nibh at mauris convallis, sed varius justo tincidunt. Sed sed varius ligula. Nunc risus neque, semper at congue consectetur, luctus vitae justo. Sed facilisis luctus eros vitae tristique. Duis at dictum erat. Quisque dapibus maximus elit, vel vehicula nibh dapibus ut. Integer id congue lacus. Duis et lacus libero. Fusce sed vehicula tortor. Cras quis elit enim.

Duis ut viverra est. Maecenas quis nisl placerat, feugiat nisl ultrices, ultrices ante. Sed tempor, tellus sed consequat rhoncus, quam nibh iaculis lacus, et luctus magna lectus sed metus. Morbi interdum nulla ut risus auctor porttitor. Morbi mattis enim nulla, sed semper est ultrices sed. Maecenas urna nulla, gravida dapibus nunc et, eleifend pretium quam. Nulla vel neque non elit interdum dignissim. Aenean mauris leo, luctus vel pretium eu, posuere eu neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer scelerisque, eros ac scelerisque pulvinar, massa mi cursus velit, vitae mollis mi justo facilisis mauris. Aliquam erat volutpat.

Phasellus molestie varius facilisis. Praesent sit amet lobortis magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec orci arcu, congue vitae laoreet imperdiet, tempor ut sapien. Phasellus nisi lectus, scelerisque cursus vulputate ut, mollis in leo. Proin ligula ligula, fermentum in elit vitae, tristique suscipit nulla. Quisque porttitor placerat purus, in porttitor felis ultrices eget. Fusce aliquet diam massa, sodales fringilla tortor tempus vitae.

Proin eget est mollis, dictum velit vulputate, mollis eros. Donec ac nisi lectus. Phasellus aliquam elit in porta pellentesque. Phasellus bibendum vitae erat non placerat. Nunc ac tortor sollicitudin, lobortis magna in, pharetra lectus. Duis fermentum semper venenatis. Donec faucibus iaculis mauris, eget tempor erat fringilla sit amet. Integer vel nunc risus. Etiam suscipit porttitor ante ac pretium. Sed congue consectetur mi, non mollis ante cursus volutpat. Nam tincidunt nisi dapibus enim maximus faucibus.

Maecenas suscipit consectetur ipsum, ac efficitur ipsum accumsan luctus. Pellentesque at neque nec dui maximus faucibus vitae eget metus. Aenean ut ullamcorper urna. Sed quis nisl pulvinar, scelerisque nunc feugiat, lacinia dui. Integer hendrerit nulla risus, eget sagittis lorem laoreet eu. Nulla eu accumsan lacus, sit amet semper sem. In hac habitasse platea dictumst. Maecenas pellentesque velit eros, a pretium odio tincidunt sed. Proin malesuada vehicula sem a porta.'
        );
        $mpdf = new \Mpdf\Mpdf();
        $mpdf->WriteHTML($emailTemplate);
        $mpdf->Output($file_name, 'D');
    }

    public function generateEmailTemplate(string $customerName, string $reportTitle, string $logoUrl, string $brandColor, string $content): string
    {
        $emailTemplate = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'DejaVu Sans', sans-serif; padding: 20px; }
                header { border-bottom: 2px solid $brandColor; margin-bottom: 20px; }
                header img { max-height: 60px; }
                h1 { color: $brandColor; }
                footer { border-top: 1px solid #ccc; margin-top: 40px; font-size: 12px; text-align: center; }
            </style>
        </head>
        <body>
            <header>
                <img src='$logoUrl' alt='Logo' />
            </header>

            <h1>$reportTitle</h1>
            <p>Generated for $customerName.</p>

            <p>$content</p>
            <footer>

            </footer>
        </body>
        </html>";

        return $emailTemplate;
    }

    private function createS3Client()
    {
        return new S3Client([
            'region' => 'eu-west-2',
            'version' => 'latest',
            'credentials' => [
                'key'    => $_ENV['AWS_ACCESS_KEY_ID'],
                'secret' => $_ENV['AWS_SECRET_ACCESS_KEY'],
            ]
        ]);
    }

    public function presignedUrl(string $filePath, string $fileType): array
    {
        $s3 = $this->createS3Client();

        $bucket = $_ENV["AWS_S3_BUCKET"];

        $cmd = $s3->getCommand('PutObject', [
            'Bucket' => $bucket,
            'Key'    => $filePath,
            'ContentType' => $fileType
        ]);

        $request = $s3->createPresignedRequest($cmd, '+15 minutes');
        $presignedUrl = (string) $request->getUri();

        return ['success' => true, 'message' => 'Presigned URL created', 'presignedUrl' => $presignedUrl];
    }

    // public function uploadDocument(string $filePath): array
    // {
    //     $s3 = $this->createS3Client();

    //     $bucket = $_ENV["AWS_S3_BUCKET"];

    //     $cmd = $s3->getCommand('PutObject', [
    //         'Bucket' => $bucket,
    //         'Key'    => $filePath,
    //         'ContentType' => 'application/pdf'
    //     ]);

    //     $request = $s3->createPresignedRequest($cmd, '+15 minutes');
    //     $presignedUrl = (string) $request->getUri();

    //     return ["presignedUrl" => $presignedUrl];
    // }
}
